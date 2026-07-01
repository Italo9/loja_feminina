import Link from "next/link"
import type { Metadata } from "next"
import { ChevronLeft, Search } from "lucide-react"
import { searchProducts } from "@/lib/products"
import { getUserRegionCookie } from "@/lib/location-server"
import { ProductCard } from "@/components/store/ProductCard"
import { store } from "@/lib/config"

export const metadata: Metadata = {
  title: "Busca",
  description: `Encontre o que procura na ${store.name}. Busque por vestidos, blusas, calças, moda praia e acessórios.`,
  robots: { index: false, follow: true },
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const region = await getUserRegionCookie()
  const products = q ? await searchProducts(q, region ?? undefined) : []

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>

        <h1 className="display-lg mb-2">Busca</h1>
        {q ? (
          <p className="body-base mb-8">
            {products.length}{" "}
            {products.length === 1 ? "resultado" : "resultados"} para &ldquo;{q}&rdquo;
          </p>
        ) : (
          <p className="body-base mb-8">Digite um termo para buscar produtos.</p>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : q ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-espresso-200 mx-auto mb-4" />
            <p className="body-base">Nenhum produto encontrado para &ldquo;{q}&rdquo;.</p>
            <p className="text-sm text-espresso-400 mt-1">
              Tente outro termo ou navegue pelo catálogo.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
