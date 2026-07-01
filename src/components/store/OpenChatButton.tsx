"use client"

import { MessageCircle } from "lucide-react"

export function OpenChatButton({
  label,
  iconOnly = false,
}: {
  label?: string
  iconOnly?: boolean
}) {
  if (iconOnly) {
    return (
      <button
        onClick={() => window.dispatchEvent(new Event("chat:open"))}
        className="w-9 h-9 rounded-full border border-[#C9A66B]/30 flex items-center justify-center text-[#C9A66B] hover:bg-[#F6D8D6]/30 hover:border-[#DCA7A7] transition-all"
        aria-label="Falar com a Lumi"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      onClick={() => window.dispatchEvent(new Event("chat:open"))}
      className="fixed z-[75] bottom-8 right-6 md:right-8 flex items-center gap-2.5 bg-gradient-to-br from-[#DCA7A7] to-[#F6D8D6] text-[#6B4A4F] rounded-full pl-3 pr-5 py-3 shadow-lift hover:shadow-xl hover:scale-105 transition-all duration-300 md:animate-[pulse-subtle_2.5s_ease-in-out_infinite] border border-white/20"
    >
      <span className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
        <MessageCircle className="w-4 h-4 text-[#6B4A4F]" />
      </span>
      <span className="text-sm font-medium tracking-wide whitespace-nowrap">
        {label ?? "Falar com a Lumi"}
      </span>
    </button>
  )
}
