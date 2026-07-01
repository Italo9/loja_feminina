import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Seu carrinho de compras na Lumière. Finalize seu pedido com segurança.",
  robots: { index: false },
}

export default function CartPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Continuar comprando
        </Link>

        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-cream-300 mx-auto mb-4" />
          <h1 className="display-md mb-2">Carrinho</h1>
          <p className="body-base mb-6">
            Clique no ícone do carrinho no topo da página para ver seus itens.
          </p>
          <Link href="/" className="btn-rose">
            <ShoppingBag className="w-4 h-4" />
            Ver loja
          </Link>
        </div>
      </div>
    </div>
  )
}
