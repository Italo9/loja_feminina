"use client"

import Link from "next/link"
import { ChevronLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  return (
    <div className="bg-pearl-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-500 hover:text-berry-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Continuar comprando
        </Link>

        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-espresso-200 mx-auto mb-4" />
          <h1 className="display-md text-espresso-900 mb-2">Carrinho</h1>
          <p className="body-base text-espresso-400 mb-6">
            Clique no ícone do carrinho no topo da página para ver seus itens.
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event("cart:open"))}
            className="inline-flex items-center gap-2 bg-berry-600 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-berry-500 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Abrir carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
