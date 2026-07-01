"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, Sparkles } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping"

export function CartSheet() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("cart:open", handler)
    return () => window.removeEventListener("cart:open", handler)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const total = subtotal()
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total)
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-plum-900/25 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-pearl-50 shadow-lift animate-slide-in-right flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 bg-pearl-100 border-b border-gold-400/15">
          <div>
            <span className="font-[family-name:var(--font-display)] text-xl font-medium tracking-[0.04em] text-plum-700">
              Sua sacola
            </span>
            <span className="ml-2 text-xs text-plum-400">
              {count === 0 ? "" : count === 1 ? "1 peça" : `${count} peças`}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 -mr-1 text-plum-400 hover:text-plum-600 transition-colors"
            aria-label="Fechar sacola"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="text-center py-20 px-6">
              <span className="inline-flex w-16 h-16 rounded-full bg-rose-100 items-center justify-center mb-5">
                <ShoppingBag className="w-7 h-7 text-blush-500" />
              </span>
              <p className="font-[family-name:var(--font-display)] text-xl text-plum-600 mb-1">
                Sua sacola está vazia
              </p>
              <p className="text-sm text-plum-400 mb-6">
                As peças que você escolher aparecem aqui.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="btn-outline text-sm px-6 py-2.5"
              >
                Ver o catálogo
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3.5 bg-white rounded-2xl p-3 border border-pearl-200 shadow-soft"
                >
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-pearl-200 flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-sm font-medium text-plum-700 line-clamp-2 leading-snug">
                      {item.name}
                    </p>
                    {item.variantInfo && (
                      <p className="text-[11px] text-plum-400 mt-0.5">{item.variantInfo}</p>
                    )}
                    <p className="text-sm font-semibold text-plum-700 mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex items-center gap-1 mt-auto pt-2">
                      <div className="inline-flex items-center rounded-full border border-pearl-300 bg-pearl-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-plum-500 hover:text-plum-700 transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[13px] font-semibold text-plum-700 w-6 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-plum-500 hover:text-plum-700 transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="ml-auto p-1.5 text-plum-300 hover:text-rose-600 transition-colors"
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rodapé com frete e total */}
        {items.length > 0 && (
          <div className="border-t border-gold-400/15 bg-white px-5 pt-4 pb-5 pb-safe">
            <div className="mb-4">
              {remaining > 0 ? (
                <p className="text-[12px] text-plum-500 mb-2">
                  Faltam{" "}
                  <span className="font-semibold text-plum-700">
                    R$ {remaining.toFixed(2).replace(".", ",")}
                  </span>{" "}
                  para o frete grátis
                </p>
              ) : (
                <p className="text-[12px] text-gold-600 font-medium mb-2 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Você ganhou frete grátis
                </p>
              )}
              <div className="h-1 rounded-full bg-pearl-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blush-400 to-gold-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <span className="text-sm text-plum-500">Subtotal</span>
              <span className="font-[family-name:var(--font-display)] text-2xl text-plum-700">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="btn-rose w-full text-[15px]"
            >
              Finalizar compra
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-center text-[12px] text-plum-400 hover:text-plum-600 transition-colors mt-3"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
