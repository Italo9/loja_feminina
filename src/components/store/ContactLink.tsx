"use client"

export function ContactLink() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("chat:open"))}
      className="text-sm text-[#6B4A4F]/70 hover:text-[#DCA7A7] transition-colors"
    >
      Contato
    </button>
  )
}
