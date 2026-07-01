"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { updateProductStatus } from "@/lib/admin-actions"

export function ToggleActiveButton({
  productId,
  active,
}: {
  productId: string
  active: boolean
}) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await updateProductStatus(productId, !active)
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="p-2 text-plum-300 hover:text-plum-600 transition-colors"
      aria-label={active ? "Desativar produto" : "Ativar produto"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : active ? (
        <Eye className="w-4 h-4" />
      ) : (
        <EyeOff className="w-4 h-4" />
      )}
    </button>
  )
}
