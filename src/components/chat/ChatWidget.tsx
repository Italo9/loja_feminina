"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, UserRound, Sparkles, MessageCircle } from "lucide-react"
import type { ChatMessage } from "@/types"
import { assistant, store, whatsappUrl } from "@/lib/config"

let msgId = 0
const nextId = () => String(++msgId)

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
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-berry-500 to-topaz-400 flex items-center justify-center flex-shrink-0 shadow-sm">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
  )
}

export function ChatWidget() {
  const mountedRef = useRef(false)
  const [ready, setReady] = useState(false)

  // Hydration guard
  useEffect(() => {
    mountedRef.current = true
    queueMicrotask(() => setReady(true))
  }, [])

  const [open, setOpen] = useState(false)
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

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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
    const handler = () => setOpen(true)
    window.addEventListener("chat:open", handler)
    return () => window.removeEventListener("chat:open", handler)
  }, [])

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

    setTimeout(() => {
      const responses = [
        `Que legal! 😍 Temos várias opções que combinam com o que você procura. Posso te mostrar alguns modelos?\n\nNossos vestidos estão a partir de R$ 49,90 e temos em diversos tamanhos e cores.`,
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

  const askForHuman = () => {
    const msg = "Oi! Gostaria de falar com um atendente humano."
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: msg, timestamp: new Date() },
      {
        id: nextId(),
        role: "assistant",
        content: "Claro! Vou te passar para nossa equipe. Enquanto isso, você já pode chamar no WhatsApp:",
        timestamp: new Date(),
      },
    ])
    window.open(whatsappUrl("Oi! Vim pelo chat da loja e gostaria de atendimento."), "_blank")
  }

  const placeholder = loading ? "Jade está escrevendo..." : "Digite sua mensagem..."

  if (!ready) return null

  return (
    <>
      {!open && (
        <div
          ref={launcherRef}
          onPointerDown={onPointerDown}
          onClick={() => { if (!drag.current.moved) setOpen(true) }}
          className="fixed z-[80] flex items-center gap-2 cursor-pointer group"
          style={
            pos
              ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
              : { right: "1rem", bottom: "5rem" }
          }
        >
          <div className="bg-white rounded-full px-4 py-2 shadow-card text-sm font-semibold text-espresso-800 whitespace-nowrap animate-fade-up">
            {PILL_PHRASES[pillIndex]}
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-berry-600 to-berry-400 shadow-lift flex items-center justify-center transition-transform group-hover:scale-110">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[85] md:inset-auto md:right-4 md:bottom-24 md:w-[380px] md:h-[600px] md:rounded-2xl overflow-hidden shadow-lift animate-slide-up bg-pearl-100 flex flex-col border md:border-pearl-200">
          <div className="flex items-center justify-between p-4 border-b border-pearl-200 bg-gradient-to-r from-berry-600 to-berry-500 text-white">
            <div className="flex items-center gap-3">
              <JadeAvatar />
              <div>
                <p className="text-sm font-bold">{assistant.name}</p>
                <p className="text-[10px] opacity-80">{assistant.role}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <JadeAvatar />}
                <div className={msg.role === "user" ? "chat-bubble-user max-w-[80%] px-4 py-2.5 text-sm leading-relaxed" : "chat-bubble-assistant max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line"}>
                  {msg.content}
                  <span className="block text-right mt-1 text-[10px] opacity-60">
                    {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2">
                <JadeAvatar />
                <div className="chat-bubble-assistant px-4 py-3 flex items-center gap-1">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          {!loading && (
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-pearl-200 flex-shrink-0 bg-white">
              <button
                onClick={askForHuman}
                className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-topaz-50 text-topaz-700 border border-topaz-200 hover:bg-topaz-100 transition-colors whitespace-nowrap"
              >
                <UserRound className="w-3.5 h-3.5" />
                Falar com humano
              </button>
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s.prompt}
                  onClick={() => sendMessage(s.prompt)}
                  className="flex-shrink-0 text-xs font-medium px-3 py-2 rounded-full bg-berry-50 text-berry-700 border border-berry-200 hover:bg-berry-100 transition-colors whitespace-nowrap"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="px-3 pt-3 border-t border-pearl-200 flex items-center gap-2 bg-white flex-shrink-0 pb-safe">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={loading}
              enterKeyHint="send"
              className="flex-1 bg-pearl-100 rounded-full px-4 py-2.5 text-[16px] text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-berry-200 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Enviar"
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                input.trim() && !loading
                  ? "bg-berry-600 text-white hover:bg-berry-500"
                  : "bg-pearl-200 text-espresso-300 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
