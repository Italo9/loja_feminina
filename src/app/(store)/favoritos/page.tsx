import type { Metadata } from "next"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Suas peças favoritas na Lumière. Salve os produtos que você mais amou.",
  robots: { index: false },
}

export default function FavoritesPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Breadcrumbs items={[{ label: "Favoritos" }]} />

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
