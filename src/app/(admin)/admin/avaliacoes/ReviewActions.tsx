"use client"

import { useState } from "react"
import { Check, X, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ReviewActions({ reviewId, approved }: { reviewId: string; approved: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    setLoading(true)
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, approved: !approved }),
    })
    router.refresh()
  }

  const remove = async () => {
    if (!confirm("Excluir esta avaliação?")) return
    setLoading(true)
    await fetch(`/api/admin/reviews?id=${reviewId}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={toggle} disabled={loading} className="p-1.5 rounded-lg hover:bg-pearl-100 transition-colors" title={approved ? "Reprovar" : "Aprovar"}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : approved ? <X className="w-4 h-4 text-plum-400" /> : <Check className="w-4 h-4 text-green-500" />}
      </button>
      <button onClick={remove} disabled={loading} className="p-1.5 rounded-lg hover:bg-pearl-100 transition-colors" title="Excluir">
        <Trash2 className="w-4 h-4 text-plum-300" />
      </button>
    </div>
  )
}
