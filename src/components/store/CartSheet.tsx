"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export function CartSheet() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("cart:open", handler)
    return () => window.removeEventListener("cart:open", handler)
  }, [])

  const total = subtotal()
  const count = items.reduce((s, i) => s + i.quantity, 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-espresso-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-pearl-100 shadow-lift animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-pearl-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-berry-600" />
            <span className="font-bold text-espresso-900">Carrinho ({count})</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 text-espresso-500 hover:text-espresso-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-espresso-200 mx-auto mb-4" />
              <p className="body-base text-espresso-400">Seu carrinho está vazio</p>
              <button onClick={() => setOpen(false)} className="mt-4 text-sm font-semibold text-berry-600 hover:text-berry-500">
                Continuar comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex gap-3 bg-white rounded-xl p-3 border border-pearl-200">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-pearl-200 flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-espresso-900 line-clamp-2">{item.name}</p>
                    {item.variantInfo && <p className="text-xs text-espresso-400 mt-0.5">{item.variantInfo}</p>}
                    <p className="price-sm text-espresso-900 mt-1">R$ {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-7 h-7 rounded-full bg-pearl-200 flex items-center justify-center hover:bg-pearl-300">
                        <Minus className="w-3 h-3 text-espresso-600" />
                      </button>
                      <span className="text-sm font-bold text-espresso-900 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-7 h-7 rounded-full bg-pearl-200 flex items-center justify-center hover:bg-pearl-300">
                        <Plus className="w-3 h-3 text-espresso-600" />
                      </button>
                      <button onClick={() => removeItem(item.productId, item.variantId)} className="ml-auto p-1.5 text-espresso-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-pearl-200 p-4 pb-safe">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-espresso-500">Subtotal</span>
              <span className="price-md text-espresso-900">R$ {total.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-espresso-400 mb-3">Frete calculado no checkout</p>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-berry-600 text-white font-bold text-[15px] hover:bg-berry-500 transition-colors active:scale-[0.97]"
            >
              Finalizar compra
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
