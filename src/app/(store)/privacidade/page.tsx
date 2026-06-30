import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function GenericPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>
        <h1 className="display-md mb-4">Política de Privacidade</h1>
        <div className="body-base space-y-4">
          <p>Seus dados são tratados com total segurança e utilizados apenas para processar seu pedido e melhorar sua experiência.</p>
          <p>Não compartilhamos suas informações com terceiros.</p>
        </div>
      </div>
    </div>
  )
}
