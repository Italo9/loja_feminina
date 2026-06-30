import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function GenericPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>
        <h1 className="display-md mb-4">Sobre nós</h1>
        <div className="body-base space-y-4">
          <p>A Lumière nasceu do desejo de oferecer moda feminina com personalidade, qualidade e preço justo.</p>
          <p>Curamos cada peça com atenção aos detalhes, tendências e ao conforto que toda mulher merece.</p>
        </div>
      </div>
    </div>
  )
}
