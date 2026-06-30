"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"

interface Props {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: { url: string }[]
    source?: string
  }
}

export function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false)
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
          source: product.source ?? "own",
        },
      })
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleAdd}
      className="btn-rose w-full text-[15px]"
    >
      <ShoppingBag className="w-4 h-4" />
      {added ? "Adicionado!" : "Comprar"}
    </button>
  )
}
