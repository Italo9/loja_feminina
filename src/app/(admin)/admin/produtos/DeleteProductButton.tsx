"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deleteProduct } from "@/lib/admin-actions"

export function DeleteProductButton({ productId }: { productId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteProduct(productId)
    } catch {
      setLoading(false)
      setConfirm(false)
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sim"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-2 py-1 text-[10px] text-plum-400 hover:text-plum-600"
        >
          Não
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="p-2 text-plum-300 hover:text-rose-500 transition-colors"
      aria-label="Excluir produto"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
