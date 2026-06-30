"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, UserRound, Sparkles, MessageCircle } from "lucide-react"
import type { ChatMessage } from "@/types"
import { assistant, store } from "@/lib/config"

let msgId = 0
const nextId = () => String(++msgId)

type Mode = "bot" | "askName" | "human"

const PILL_PHRASES = [
  `Fale com a ${assistant.name}`,
  `Tire dúvidas com a ${assistant.name}`,
  `Veja preços com a ${assistant.name}`,
  `Peça ajuda à ${assistant.name}`,
  `Monte seu look com a ${assistant.name}`,
]

const SUGGESTIONS = [
  { label: "Quais vestidos vocês têm?", prompt: "Quais vestidos vocês têm disponíveis?" },
  { label: "Tem tamanho G?", prompt: "Vocês têm peças no tamanho G?" },
  { label: "Novidades da semana", prompt: "Quais são as novidades desta semana?" },
  { label: "Looks para festa", prompt: "Me ajuda a montar um look para festa?" },
  { label: "Formas de pagamento", prompt: "Quais são as formas de pagamento?" },
  { label: "Frete e entrega", prompt: "Como funciona o frete e prazo de entrega?" },
]

function JadeAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
  )
}

export function ChatWidget() {
  const mountedRef = useRef(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    queueMicrotask(() => setReady(true))
  }, [])

  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [mode, setMode] = useState<Mode>("bot")
  const modeRef = useRef<Mode>("bot")
  const [sessionId, setSessionId] = useState("")
  const [clientName, setClientName] = useState("")
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionRef = useRef("")
  const [unread, setUnread] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: `Oi! Eu sou a ${assistant.name} ✨, ${assistant.role} da ${store.name}.\n\nPosso te ajudar a encontrar a peça perfeita, conferir preços, tamanhos disponíveis e montar looks incríveis. O que você procura hoje?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [pillIndex, setPillIndex] = useState(0)
  const [whatsappOnline, setWhatsappOnline] = useState(false)
  const whatsappChecked = useRef(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 })
  const launcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setPillIndex((i) => (i + 1) % PILL_PHRASES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    const handler = () => { setOpen(true); setMinimized(false); setUnread(0) }
    window.addEventListener("chat:open", handler)
    return () => window.removeEventListener("chat:open", handler)
  }, [])

  useEffect(() => {
    if (open && !whatsappChecked.current) {
      whatsappChecked.current = true
      fetch("/api/human/qr").then(r => r.json()).then(d => {
        setWhatsappOnline(d.connection === "open")
      }).catch(() => {})
    }
  }, [open])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const setModeAndRef = useCallback((m: Mode) => {
    setMode(m)
    modeRef.current = m
  }, [])

  const startHuman = useCallback(async (name: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setSessionId(id)
    sessionRef.current = id
    setClientName(name)

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "assistant", content: `Certo! Vou te conectar com um de nossos atendentes humanos. Enquanto isso, pode me contar o que você procura.`, timestamp: new Date(), human: true },
    ])

    await fetch("/api/human/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id, name }),
    })

    setModeAndRef("human")
  }, [setModeAndRef])

  // Human polling
  useEffect(() => {
    if (mode !== "human" || !sessionId) {
      stopPolling()
      return
    }
    stopPolling()
    const sid = sessionId
    pollRef.current = setInterval(async () => {
      if (modeRef.current !== "human") { stopPolling(); return }
      try {
        const r = await fetch(`/api/human/poll?sessionId=${encodeURIComponent(sid)}`)
        const d = await r.json()
        if (Array.isArray(d.messages)) {
          for (const m of d.messages) {
            setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: m.text, timestamp: new Date(), human: true }])
            if (!open) setUnread((n) => n + 1)
          }
        }
        if (d.ended) { stopPolling(); setModeAndRef("bot") }
        else if (d.active === false) { stopPolling(); setModeAndRef("bot") }
      } catch (_) {}
    }, 3000)
    return () => stopPolling()
  }, [mode, sessionId, stopPolling, setModeAndRef, open])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current.active = true
    drag.current.moved = false
    drag.current.startX = e.clientX
    drag.current.startY = e.clientY
    const rect = launcherRef.current?.getBoundingClientRect()
    if (rect) {
      drag.current.originX = rect.left
      drag.current.originY = rect.top
    }
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.startX
      const dy = e.clientY - drag.current.startY
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true
      if (drag.current.moved) {
        setPos({ x: drag.current.originX + dx, y: drag.current.originY + dy })
      }
    }
    const onUp = () => { drag.current.active = false }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return
    const userMsg: ChatMessage = { id: nextId(), role: "user", content: content.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    if (modeRef.current === "human" && sessionRef.current) {
      await fetch("/api/human/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionRef.current, text: content.trim() }),
      })
      setLoading(false)
      return
    }

    setTimeout(() => {
      const responses = [
        `Que legal! 🥰 Temos várias opções que combinam com o que você procura. Posso te mostrar alguns modelos?\n\nNossos vestidos estão a partir de R$ 49,90 e temos em diversos tamanhos e cores.`,
        `Olha que maravilha! ✨ Acabaram de chegar peças novas na coleção Verão 2026. Temos vestidos, conjuntos e moda praia com estampas exclusivas.\n\nQuer ver algo específico?`,
        `Claro! 🛍️ Trabalhamos com cartão de crédito em até 3x sem juros, PIX com desconto e boleto bancário. O frete é grátis para compras acima de R$ 250!\n\nPosso te ajudar a encontrar algo especial?`,
        `Ótima escolha! 💫 Nossas peças são selecionadas com muito carinho. Temos do P ao G e algumas peças no tamanho 44 e 46 também.\n\nQual estilo você prefere? Casual, festa, praia?`,
      ]
      const reply = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: reply, timestamp: new Date() }])
      setLoading(false)
    }, 1500)
  }, [loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = clientName.trim()
    if (!name) return
    startHuman(name)
  }

  const askForHuman = () => {
    setModeAndRef("askName")
    setClientName("")
    setInput("")
    queueMicrotask(() => nameInputRef.current?.focus())
  }

  const endHuman = async () => {
    stopPolling()
    if (sessionRef.current) {
      await fetch("/api/human/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionRef.current }),
      })
    }
    setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: "O atendimento foi encerrado. Se precisar de mais ajuda, é só chamar! 💕", timestamp: new Date() }])
    setModeAndRef("bot")
  }

  const placeholder = loading ? "Jade está escrevendo..." : mode === "human" ? "Digite sua mensagem..." : "Digite sua mensagem..."

  if (!ready) return null

  const isHumanMode = mode === "human"

  return (
    <>
      {!open && (
        <div
          ref={launcherRef}
          onPointerDown={onPointerDown}
          onClick={() => { if (!drag.current.moved) { setOpen(true); setMinimized(false); setUnread(0) } }}
          className="fixed z-[80] flex items-center gap-2 cursor-pointer group"
          style={
            pos
              ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
              : { right: "1rem", bottom: "5rem" }
          }
        >
          <div className="bg-white rounded-full px-4 py-2 shadow-card text-sm font-semibold text-espresso-700 whitespace-nowrap animate-fade-up border border-cream-200">
            {PILL_PHRASES[pillIndex]}
          </div>
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-400 shadow-lift flex items-center justify-center transition-transform group-hover:scale-110">
            <MessageCircle className="w-6 h-6 text-white" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#25d366] text-white text-[10px] font-bold flex items-center justify-center shadow">
                {unread}
              </span>
            )}
          </div>
        </div>
      )}

      {open && !minimized && (
        <>
          <div className="fixed inset-0 z-[84] bg-espresso-900/20 md:bg-transparent" onClick={() => { setMinimized(true); setOpen(false) }} />
          <div className="fixed inset-0 z-[85] md:inset-auto md:right-4 md:bottom-24 md:w-[380px] md:h-[600px] md:rounded-2xl overflow-hidden shadow-lift animate-slide-up bg-white flex flex-col border md:border-cream-200">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b text-white ${isHumanMode ? "bg-[#075e54] border-[#075e54]" : "bg-rose-500 border-cream-200"}`}>
            <div className="flex items-center gap-3">
              {isHumanMode ? (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <UserRound className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold">{isHumanMode ? "Atendente" : assistant.name}</p>
                <p className="text-[10px] opacity-80">{isHumanMode ? "Modo humano · WhatsApp" : assistant.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isHumanMode && (
                <button onClick={endHuman} className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-[10px] font-semibold uppercase tracking-wider">
                  Encerrar
                </button>
              )}
              <button onClick={() => { setOpen(false); setMinimized(false) }} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 space-y-4 ${isHumanMode ? "bg-[#e5ddd5]" : "bg-cream-50"}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  msg.human ? (
                    <div className="w-8 h-8 rounded-full bg-[#075e54] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <UserRound className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <JadeAvatar />
                  )
                )}
                <div className={
                  msg.role === "user"
                    ? `max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${isHumanMode ? "bg-[#d9fdd3] text-espresso-800" : "chat-bubble-user"} rounded-[18px_18px_4px_18px]`
                    : `max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${isHumanMode ? "bg-white text-espresso-700 shadow-sm" : "chat-bubble-assistant"} rounded-[18px_18px_18px_4px]`
                }>
                  {msg.human && (
                    <span className="block text-[10px] font-semibold text-[#075e54] mb-0.5">Atendente</span>
                  )}
                  {msg.content}
                  <span className="block text-right mt-1 text-[10px] opacity-40">
                    {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2">
                {isHumanMode ? (
                  <div className="w-8 h-8 rounded-full bg-[#075e54] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <UserRound className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <JadeAvatar />
                )}
                <div className={`px-4 py-3 flex items-center gap-1 ${isHumanMode ? "bg-white shadow-sm" : "chat-bubble-assistant"} rounded-[18px_18px_18px_4px]`}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* Name input */}
            {mode === "askName" && (
              <form onSubmit={handleNameSubmit} className="flex items-end gap-2">
                <JadeAvatar />
                <div className="chat-bubble-assistant max-w-[85%] px-4 py-3 space-y-2">
                  <p className="text-sm">Como você gostaria de ser chamada?</p>
                  <div className="flex gap-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Seu nome"
                      className="flex-1 bg-cream-50 border border-cream-200 rounded-full px-3 py-1.5 text-sm text-espresso-700 focus:outline-none focus:border-rose-300"
                    />
                    <button type="submit" disabled={!clientName.trim()} className="px-4 py-1.5 bg-rose-500 text-white text-sm font-semibold rounded-full disabled:opacity-50">
                      OK
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Suggestions / human UI */}
          {!loading && mode !== "askName" && (
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-cream-200 flex-shrink-0 bg-white">
              {!isHumanMode ? (
                <>
                  {whatsappOnline ? (
                    <button onClick={askForHuman} className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors whitespace-nowrap">
                      <UserRound className="w-3.5 h-3.5" />
                      Falar com humano
                    </button>
                  ) : (
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-cream-100 text-espresso-300 border border-cream-200 whitespace-nowrap cursor-not-allowed">
                      <UserRound className="w-3.5 h-3.5" />
                      Atendente offline
                    </span>
                  )}
                  {SUGGESTIONS.slice(0, 2).map((s) => (
                    <button key={s.prompt} onClick={() => sendMessage(s.prompt)} className="flex-shrink-0 text-xs font-medium px-3 py-2 rounded-full bg-cream-100 text-espresso-600 border border-cream-200 hover:bg-cream-200 transition-colors whitespace-nowrap">
                      {s.label}
                    </button>
                  ))}
                </>
              ) : (
                <p className="text-xs text-[#075e54] font-medium py-2 w-full text-center">
                  Você está falando com um atendente humano via WhatsApp
                </p>
              )}
            </div>
          )}

          {/* Input */}
          {mode !== "askName" && (
            <div className={`px-3 pt-3 border-t flex items-center gap-2 flex-shrink-0 pb-safe ${isHumanMode ? "bg-[#f0f0f0] border-[#e0e0e0]" : "bg-white border-cream-200"}`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
                enterKeyHint="send"
                className={`flex-1 rounded-full px-4 py-2.5 text-[16px] focus:outline-none disabled:opacity-50 ${isHumanMode ? "bg-white border border-[#e0e0e0] text-espresso-700 placeholder:text-espresso-300" : "bg-cream-50 border border-cream-200 text-espresso-700 placeholder:text-espresso-300 focus:ring-2 focus:ring-rose-200"}`}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Enviar"
                className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  input.trim() && !loading
                    ? isHumanMode ? "bg-[#075e54] text-white hover:bg-[#054d44]" : "bg-rose-500 text-white hover:bg-rose-600"
                    : isHumanMode ? "bg-[#e0e0e0] text-espresso-300 cursor-not-allowed" : "bg-cream-200 text-espresso-300 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        </>
      )}
    </>
  )
}
