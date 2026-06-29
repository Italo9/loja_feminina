import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getNewProducts, getCategories } from "@/lib/products"
import { ProductCard } from "@/components/store/ProductCard"

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([getNewProducts(), getCategories()])

  return (
    <div className="bg-pearl-100 min-h-screen">
      <div className="container-narrow py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-500 hover:text-berry-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>
        <h1 className="display-lg text-espresso-900 mb-6">Catálogo Completo</h1>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(cat => (
              <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-pearl-200 text-espresso-600 text-sm font-medium hover:border-berry-300 transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-center py-20 text-espresso-400">Nenhum produto disponível no momento.</p>
        )}
      </div>
    </div>
  )
}
