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
      className="btn-rose w-full text-[15px]"
    >
      <ShoppingBag className="w-4 h-4" />
      Comprar
    </button>
  )
}
