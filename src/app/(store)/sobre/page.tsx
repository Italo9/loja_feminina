import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"
import { store } from "@/lib/config"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça a história da ${store.name}. ${store.tagline}. Moda feminina premium com curadoria especial em ${store.city}.`,
  openGraph: {
    title: `Sobre — ${store.name}`,
    description: store.tagline,
    type: "website",
  },
}

export default function GenericPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Breadcrumbs items={[{ label: "Sobre" }]} />
        <h1 className="display-md mb-4">Sobre nós</h1>
        <div className="body-base space-y-4">
          <p>A Lumière nasceu do desejo de oferecer moda feminina com personalidade, qualidade e preço justo.</p>
          <p>Curamos cada peça com atenção aos detalhes, tendências e ao conforto que toda mulher merece.</p>
        </div>
      </div>
    </div>
  )
}
