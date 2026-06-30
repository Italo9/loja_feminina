import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function GenericPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>
        <h1 className="display-md mb-4">Entrega</h1>
        <div className="body-base space-y-4">
          <p>Enviamos para todo o Brasil com prazos que variam de acordo com a região.</p>
          <p><strong>Frete grátis</strong> para compras acima de R$ 250,00.</p>
          <p>O prazo de processamento é de 1 a 2 dias úteis após a confirmação do pagamento.</p>
          <p>Você receberá um código de rastreamento por e-mail assim que o pedido for despachado.</p>
        </div>
      </div>
    </div>
  )
}
