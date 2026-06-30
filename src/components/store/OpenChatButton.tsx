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
        className="w-10 h-10 rounded-full border border-cream-200 flex items-center justify-center text-espresso-400 hover:border-rose-300 hover:text-rose-500 transition-all"
        aria-label="Falar com a Jade"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      onClick={() => window.dispatchEvent(new Event("chat:open"))}
      className="btn-outline"
    >
      <MessageCircle className="w-4 h-4" />
      {label ?? "Falar com a Jade"}
    </button>
  )
}
