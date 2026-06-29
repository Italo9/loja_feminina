"use client"

import { useEffect } from "react"
import { useCartStore, CartItem } from "@/lib/cart-store"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CartItem>).detail
      addItem(detail)
    }
    window.addEventListener("cart:add", handler)
    return () => window.removeEventListener("cart:add", handler)
  }, [addItem])

  return <>{children}</>
}
