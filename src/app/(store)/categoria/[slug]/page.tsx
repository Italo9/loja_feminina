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
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>

        <h1 className="display-lg mb-2">{category?.name ?? slug}</h1>
        {category?.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href={`/categoria/${slug}`} className="px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-semibold">Todos</Link>
            {category.children.map(sub => (
              <Link key={sub.slug} href={`/categoria/${sub.slug}`} className="px-4 py-2 rounded-full bg-white border border-cream-200 text-espresso-500 text-sm font-medium hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm">
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
            <p className="display-sm mb-2">Nenhum produto encontrado</p>
            <p className="body-base mb-6">Esta categoria ainda não tem produtos.</p>
            <Link href="/catalogo" className="btn-rose">
              Ver catálogo completo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
