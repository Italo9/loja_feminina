import { ChevronLeft, Lock } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  return (
    <div className="bg-pearl-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/carrinho" className="inline-flex items-center gap-1 text-sm text-espresso-500 hover:text-berry-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Voltar ao carrinho
        </Link>

        <h1 className="display-lg text-espresso-900 mb-2">Checkout</h1>
        <p className="body-base text-espresso-500 mb-8">Finalize sua compra de forma segura.</p>

        {/* Placeholder */}
        <div className="bg-white rounded-2xl p-8 border border-pearl-200 text-center">
          <Lock className="w-10 h-10 text-espresso-300 mx-auto mb-4" />
          <p className="display-sm text-espresso-400 mb-2">Em breve</p>
          <p className="body-sm text-espresso-400">
            A integração com Stripe está sendo configurada. Você poderá pagar com cartão de crédito, Pix e boleto.
          </p>
        </div>
      </div>
    </div>
  )
}
