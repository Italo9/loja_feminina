"use client"

import { ShoppingBag } from "lucide-react"
import type { Product } from "@/types"

export function StickyAddToCart({ product }: { product: Product }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-white/95 backdrop-blur-xl border-t border-cream-200 px-4 py-3 safe-bottom">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-espresso-400 truncate">{product.name}</p>
          <p className="text-sm font-bold text-espresso-800">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("add-to-cart", {
                detail: {
                  productId: product.id,
                  variantId: null,
                  name: product.name,
                  image: product.images?.[0]?.url ?? null,
                  price: product.price,
                  maxStock: 99,
                  source: product.source,
                },
              }),
            )
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-rose-500 text-white text-sm font-bold active:scale-95 transition-transform"
        >
          <ShoppingBag className="w-4 h-4" />
          Adicionar
        </button>
      </div>
    </div>
  )
}
