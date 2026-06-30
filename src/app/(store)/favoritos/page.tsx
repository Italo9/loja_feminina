import Link from "next/link"
import { ChevronLeft, Heart } from "lucide-react"

export default function FavoritesPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>

        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-rose-200 mx-auto mb-4" />
          <h1 className="display-md mb-2">Favoritos</h1>
          <p className="body-base mb-6">
            Você ainda não salvou nenhuma peça. Explore o catálogo e favorite as que mais gostar!
          </p>
          <Link href="/catalogo" className="btn-rose">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
