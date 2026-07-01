"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, UserRound, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
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
    <div className="w-8 h-8 rounded-full bg-[#DCA7A7] flex items-center justify-center flex-shrink-0 shadow-sm">
      <Sparkles className="w-4 h-4 text-[#C9A66B]" />
    </div>
  )
}

export function ChatWidget() {
  const mountedRef = useRef(false)
  const [ready, setReady] = useState(false)
  const { data: session } = useSession()
  const userName = session?.user?.name?.split(" ")[0]

  useEffect(() => {
    mountedRef.current = true
    queueMicrotask(() => setReady(true))
  }, [])

  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [closed, setClosed] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const reminderRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
      content: `Olá! Eu sou a ${assistant.name}, assistente virtual da ${store.name}. Estou aqui para ajudar você a encontrar o look perfeito.`,
      timestamp: new Date(),
    },
  ])

  // Personaliza saudação quando sessão carrega
  useEffect(() => {
    if (userName && userName.length > 1) {
      setMessages((prev) =>
        prev[0]?.id === "welcome"
          ? [
              {
                ...prev[0],
                content: `Olá, ${userName}! Eu sou a ${assistant.name}, assistente virtual da ${store.name}. Estou aqui para ajudar você a encontrar o look perfeito.`,
              },
              ...prev.slice(1),
            ]
          : prev,
      )
    }
  }, [userName])
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
    // Captura o ponteiro: o drag continua recebendo eventos mesmo se o dedo
    // sair do launcher, e o navegador nao transforma o gesto em scroll.
    launcherRef.current?.setPointerCapture(e.pointerId)
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.startX
      const dy = e.clientY - drag.current.startY
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true
      if (drag.current.moved) {
        const rect = launcherRef.current?.getBoundingClientRect()
        const w = rect?.width ?? 56
        const h = rect?.height ?? 56
        const margin = 8
        const x = Math.min(Math.max(drag.current.originX + dx, margin), window.innerWidth - w - margin)
        const y = Math.min(Math.max(drag.current.originY + dy, margin), window.innerHeight - h - margin)
        setPos({ x, y })
      }
    }
    const onEnd = () => { drag.current.active = false }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onEnd)
    window.addEventListener("pointercancel", onEnd)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onEnd)
      window.removeEventListener("pointercancel", onEnd)
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
      {!open && !closed && (
        <div
          ref={launcherRef}
          onPointerDown={onPointerDown}
          onClick={() => { if (!drag.current.moved) { setOpen(true); setMinimized(false); setUnread(0) } }}
          className="fixed z-[80] flex items-center gap-2 cursor-pointer group touch-none select-none"
          style={
            pos
              ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
              : { right: "1.25rem", bottom: "5rem" }
          }
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-soft text-sm font-medium text-[#6B4A4F] whitespace-nowrap animate-fade-up border border-[#F6D8D6]/50">
            {PILL_PHRASES[pillIndex]}
          </div>
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#DCA7A7] to-[#F6D8D6] shadow-lift flex items-center justify-center transition-transform group-hover:scale-110">
            <Sparkles className="w-6 h-6 text-[#C9A66B]" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C9A66B] text-white text-[10px] font-bold flex items-center justify-center shadow">
                {unread}
              </span>
            )}
          </div>
        </div>
      )}

      {open && !minimized && (
        <>
          <div className="fixed inset-0 z-[84] bg-[#6B4A4F]/20 md:bg-transparent" onClick={() => { setMinimized(true); setOpen(false) }} />
          <div className="fixed inset-0 z-[85] md:inset-auto md:right-4 md:bottom-24 md:w-[380px] md:h-[600px] md:rounded-2xl overflow-hidden shadow-lift animate-slide-up bg-white flex flex-col border border-[#F6D8D6]/30">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b text-white ${isHumanMode ? "bg-[#6B4A4F] border-[#6B4A4F]" : "bg-[#F6D8D6] border-[#F6D8D6]"}`}>
            <div className="flex items-center gap-3">
              {isHumanMode ? (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <UserRound className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                </div>
              )}
              <div>
                <p className="font-[family-name:var(--font-display)] text-base font-medium tracking-wide">
                  {isHumanMode ? "Atendente" : `${assistant.name} — sua stylist virtual`}
                </p>
                <p className="text-[10px] opacity-70 font-light tracking-wide">
                  {isHumanMode ? "Modo humano · WhatsApp" : assistant.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isHumanMode && (
                <button onClick={endHuman} className="px-2.5 py-1 rounded-full hover:bg-white/20 transition-colors text-[10px] font-medium uppercase tracking-wider">
                  Encerrar
                </button>
              )}
              <button onClick={() => { setOpen(false); setMinimized(false) }} className="p-1.5 rounded-full hover:bg-white/20 transition-colors hidden md:block">
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  setMinimized(false)
                  setClosed(true)
                  reminderRef.current = setTimeout(() => setShowReminder(true), 60000)
                }}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFF6F2]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  msg.human ? (
                    <div className="w-8 h-8 rounded-full bg-[#6B4A4F] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <UserRound className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <JadeAvatar />
                  )
                )}
                <div className={
                  msg.role === "user"
                    ? `max-w-[80%] px-4 py-2.5 text-sm leading-relaxed bg-[#DCA7A7] text-white rounded-2xl rounded-br-md`
                    : `max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line bg-rose-50 text-[#6B4A4F] rounded-2xl rounded-bl-md border border-[#F6D8D6]`
                }>
                  {msg.human && (
                    <span className="block text-[10px] font-semibold text-[#C9A66B] mb-0.5">Atendente</span>
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
                  <div className="w-8 h-8 rounded-full bg-[#6B4A4F] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <UserRound className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <JadeAvatar />
                )}
                <div className="px-4 py-3 flex items-center gap-1 bg-rose-50 border border-[#F6D8D6] rounded-2xl rounded-bl-md">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-[pulse-glow_1.4s_ease-in-out_infinite]" />
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-[pulse-glow_1.4s_ease-in-out_0.2s_infinite]" />
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-[pulse-glow_1.4s_ease-in-out_0.4s_infinite]" />
                </div>
              </div>
            )}

            {/* Name input */}
            {mode === "askName" && (
              <form onSubmit={handleNameSubmit} className="flex items-end gap-2">
                <JadeAvatar />
                <div className="bg-rose-50 border border-[#F6D8D6] max-w-[85%] px-4 py-3 space-y-2 rounded-2xl rounded-bl-md">
                  <p className="text-sm text-[#6B4A4F]">Como você gostaria de ser chamada?</p>
                  <div className="flex gap-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Seu nome"
                      className="flex-1 bg-white border border-[#F6D8D6] rounded-full px-3 py-1.5 text-sm text-[#6B4A4F] placeholder:text-[#B58FA2] focus:outline-none focus:border-[#C9A66B]"
                    />
                    <button type="submit" disabled={!clientName.trim()} className="px-4 py-1.5 bg-[#DCA7A7] text-white text-sm font-medium rounded-full disabled:opacity-50 hover:bg-[#B58FA2] transition-colors">
                      OK
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Suggestions / human UI */}
          {!loading && mode !== "askName" && (
            <div className="px-3 py-2.5 flex gap-1.5 overflow-x-auto border-t border-[#F6D8D6]/30 flex-shrink-0 bg-white">
              {!isHumanMode ? (
                <>
                  {whatsappOnline ? (
                    <button onClick={askForHuman} className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-[#FFF6F2] text-[#6B4A4F] border border-[#DCA7A7]/40 hover:bg-[#F6D8D6]/30 transition-colors whitespace-nowrap">
                      <UserRound className="w-3.5 h-3.5 text-[#C9A66B]" />
                      Falar com humano
                    </button>
                  ) : (
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-cream-100 text-[#B58FA2] border border-cream-200 whitespace-nowrap cursor-not-allowed">
                      <UserRound className="w-3.5 h-3.5" />
                      Atendente offline
                    </span>
                  )}
                  {SUGGESTIONS.slice(0, 2).map((s) => (
                    <button key={s.prompt} onClick={() => sendMessage(s.prompt)} className="flex-shrink-0 text-xs font-medium px-3 py-2 rounded-full bg-[#FFF6F2] text-[#6B4A4F] border border-[#F6D8D6]/40 hover:bg-[#F6D8D6]/20 transition-colors whitespace-nowrap">
                      {s.label}
                    </button>
                  ))}
                </>
              ) : (
                <p className="text-xs text-[#C9A66B] font-medium py-2 w-full text-center">
                  Você está falando com um atendente humano via WhatsApp
                </p>
              )}
            </div>
          )}

          {/* Input */}
          {mode !== "askName" && (
            <div className="px-3 pt-2.5 pb-3 border-t border-[#F6D8D6]/30 flex items-center gap-2 flex-shrink-0 pb-safe bg-white">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
                enterKeyHint="send"
                className="flex-1 rounded-full px-4 py-2.5 text-[16px] bg-[#FFF6F2] border border-[#F6D8D6] text-[#6B4A4F] placeholder:text-[#B58FA2] focus:outline-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#C9A66B]/15 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Enviar"
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  input.trim() && !loading
                    ? "bg-[#DCA7A7] text-white hover:bg-[#B58FA2] shadow-sm"
                    : "bg-[#F6D8D6]/40 text-[#B58FA2]/40 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        </>
      )}
      {closed && showReminder && (
        <button
          onClick={() => {
            setClosed(false)
            setShowReminder(false)
            setOpen(true)
            if (reminderRef.current) clearTimeout(reminderRef.current)
          }}
          className="fixed z-[82] bottom-20 right-4 md:hidden px-4 py-2.5 rounded-2xl bg-white shadow-lift border border-rose-100 text-sm text-plum-600 animate-slide-up"
        >
          💬 Falar com a {assistant.name}
        </button>
      )}
    </>
  )
}
