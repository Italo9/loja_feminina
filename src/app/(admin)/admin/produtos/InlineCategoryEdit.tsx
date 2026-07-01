"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function InlineCategoryEdit({
  productId,
  currentCategoryId,
  categories,
}: {
  productId: string
  currentCategoryId: string
  categories: { id: string; name: string }[]
}) {
  const [changing, setChanging] = useState(false)
  const router = useRouter()

  const handleChange = async (categoryId: string) => {
    if (categoryId === currentCategoryId) return
    setChanging(true)
    try {
      const res = await fetch("/api/admin/update-product-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, categoryId }),
      })
      if (res.ok) router.refresh()
    } catch { /* */ }
    setChanging(false)
  }

  return (
    <div className="flex items-center gap-1">
      {changing ? (
        <Loader2 className="w-3 h-3 animate-spin text-plum-400" />
      ) : (
        <select
          defaultValue={currentCategoryId}
          onChange={(e) => handleChange(e.target.value)}
          className="text-[10px] px-1.5 py-0.5 rounded border border-pearl-200 bg-pearl-50 text-plum-500"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
