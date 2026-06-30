"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
      <div className="absolute inset-0 bg-espresso-900/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-lift animate-slide-in-right flex flex-col border-l border-cream-200">
        <div className="flex items-center justify-between p-4 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <span className="font-semibold text-espresso-800">Carrinho ({count})</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 text-espresso-400 hover:text-espresso-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-cream-300 mx-auto mb-4" />
              <p className="body-base">Seu carrinho está vazio</p>
              <button onClick={() => setOpen(false)} className="mt-4 text-sm font-semibold text-rose-500 hover:text-rose-400 transition-colors">
                Continuar comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex gap-3 bg-cream-50 rounded-xl p-3 border border-cream-200">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-espresso-800 line-clamp-2">{item.name}</p>
                    {item.variantInfo && <p className="text-xs text-espresso-400 mt-0.5">{item.variantInfo}</p>}
                    <p className="price-sm text-espresso-700 mt-1">R$ {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors">
                        <Minus className="w-3 h-3 text-espresso-600" />
                      </button>
                      <span className="text-sm font-bold text-espresso-800 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors">
                        <Plus className="w-3 h-3 text-espresso-600" />
                      </button>
                      <button onClick={() => removeItem(item.productId, item.variantId)} className="ml-auto p-1.5 text-espresso-400 hover:text-red-500 transition-colors">
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
          <div className="border-t border-cream-200 p-4 pb-safe">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-espresso-500">Subtotal</span>
              <span className="price-md text-espresso-800">R$ {total.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-espresso-400 mb-3">Frete grátis acima de R$ 250</p>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="btn-rose w-full text-[15px]"
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
