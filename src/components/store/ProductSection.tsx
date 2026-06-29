import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Product } from "@/types"
import { ProductCard } from "./ProductCard"

export function ProductSection({
  title,
  subtitle,
  products,
  href,
}: {
  title: string
  subtitle?: string
  products: Product[]
  href?: string
}) {
  if (products.length === 0) {
    return (
      <section className="section-padding bg-pearl-100">
        <div className="container-narrow text-center">
          <h2 className="display-lg text-espresso-900 mb-3">{title}</h2>
          <p className="body-lg text-espresso-500 mb-6">
            Nenhum produto encontrado. Volte em breve!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-pearl-100">
      <div className="container-narrow">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="display-lg text-espresso-900 mb-2">{title}</h2>
            {subtitle && (
              <p className="body-lg text-espresso-500">{subtitle}</p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-berry-600 hover:text-berry-500 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        {href && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-berry-600 text-white font-semibold px-8 py-3 rounded-full text-[15px] hover:bg-berry-500 transition-colors active:scale-95"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
