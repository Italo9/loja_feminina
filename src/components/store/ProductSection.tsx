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
      <section className="section-padding bg-white">
        <div className="container-narrow text-center">
          <h2 className="display-lg mb-3">{title}</h2>
          <p className="body-lg">
            Nenhuma peça por aqui ainda. Volte em breve.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block w-12 h-0.5 bg-rose-300 mb-5" />
            <h2 className="display-lg mb-2">{title}</h2>
            {subtitle && <p className="body-lg">{subtitle}</p>}
          </div>
          {href && (
            <Link
              href={href}
              className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium text-rose-500 hover:text-rose-400 transition-colors whitespace-nowrap pb-2"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {href && (
          <div className="mt-10 text-center sm:hidden">
            <Link href={href} className="btn-outline">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
