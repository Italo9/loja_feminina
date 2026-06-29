import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { getProductsByCategory, getCategories } from "@/lib/products"
import { ProductCard } from "@/components/store/ProductCard"

interface Props { params: Promise<{ slug: string }> }

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const products = await getProductsByCategory(slug)
  const allCategories = await getCategories()
  const category = allCategories.find(c => c.slug === slug)

  if (!category && products.length === 0) notFound()

  return (
    <div className="bg-pearl-100 min-h-screen">
      <div className="container-narrow py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-500 hover:text-berry-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>

        <h1 className="display-lg text-espresso-900 mb-2">{category?.name ?? slug}</h1>
        {category?.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href={`/categoria/${slug}`} className="px-4 py-2 rounded-full bg-berry-600 text-white text-sm font-bold">Todos</Link>
            {category.children.map(sub => (
              <Link key={sub.slug} href={`/categoria/${sub.slug}`} className="px-4 py-2 rounded-full bg-white border border-pearl-200 text-espresso-600 text-sm font-medium hover:border-berry-300 transition-colors">
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="display-sm text-espresso-400 mb-2">Nenhum produto encontrado</p>
            <p className="body-base text-espresso-400 mb-6">Esta categoria ainda não tem produtos.</p>
            <Link href="/catalogo" className="inline-flex items-center gap-2 bg-berry-600 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-berry-500 transition-colors">
              Ver catálogo completo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
