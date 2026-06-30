import { ChevronLeft, Lock } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/carrinho" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Voltar ao carrinho
        </Link>

        <h1 className="display-lg mb-2">Checkout</h1>
        <p className="body-lg mb-8">Finalize sua compra de forma segura.</p>

        <div className="surface p-8 text-center !rounded-2xl">
          <Lock className="w-10 h-10 text-cream-300 mx-auto mb-4" />
          <p className="display-sm mb-2">Em breve</p>
          <p className="body-sm">
            A integração com Stripe está sendo configurada. Você poderá pagar com cartão de crédito, Pix e boleto.
          </p>
        </div>
      </div>
    </div>
  )
}
