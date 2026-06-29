"use client"

import { ShoppingBag } from "lucide-react"

interface Props {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: { url: string }[]
  }
}

export function AddToCartButton({ product }: Props) {
  const image = product.images?.[0]?.url ?? null

  const handleAdd = () => {
    // Dispatch custom event for cart context
    window.dispatchEvent(
      new CustomEvent("cart:add", {
        detail: {
          productId: product.id,
          variantId: null,
          name: product.name,
          image,
          price: product.price,
          quantity: 1,
          variantInfo: null,
          maxStock: 99,
        },
      })
    )
    // Brief feedback
    const btn = document.activeElement as HTMLElement
    if (btn) {
      const orig = btn.textContent
      btn.textContent = "Adicionado!"
      setTimeout(() => { btn.textContent = orig }, 1500)
    }
  }

  return (
    <button
      onClick={handleAdd}
      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-berry-600 hover:bg-berry-500 text-white font-bold text-[15px] transition-all active:scale-[0.97]"
    >
      <ShoppingBag className="w-4 h-4" />
      Comprar
    </button>
  )
}
