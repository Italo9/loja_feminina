import Link from "next/link"
import { getCatalogProducts, getCategories } from "@/lib/products"
import { ProductCard } from "@/components/store/ProductCard"
import { Pagination } from "@/components/store/Pagination"
import { FilterBar } from "@/components/store/FilterBar"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export const revalidate = 60

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const sort = (sp.sort as string) || "newest"
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined

  const [result, categories] = await Promise.all([
    getCatalogProducts({ page, perPage: 12, sort, minPrice, maxPrice }),
    getCategories(),
  ])

  const { products, total, pages: totalPages } = result

  const currentSearch = new URLSearchParams()
  if (sort !== "newest") currentSearch.set("sort", sort)
  if (minPrice !== undefined) currentSearch.set("minPrice", String(minPrice))
  if (maxPrice !== undefined) currentSearch.set("maxPrice", String(maxPrice))

  const buildHref = (p: number) => {
    const params = new URLSearchParams(currentSearch)
    if (p > 1) params.set("page", String(p))
    else params.delete("page")
    const qs = params.toString()
    return `/catalogo${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Breadcrumbs items={[{ label: "Catálogo" }]} />
        <h1 className="display-lg mb-6">Catálogo Completo</h1>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-cream-200 text-espresso-500 text-sm font-medium hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <FilterBar
          currentSort={sort}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          baseUrl="/catalogo"
          currentSearch={currentSearch.toString()}
        />

        <p className="text-sm text-espresso-400 mb-4">
          {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              buildHref={buildHref}
            />
          </>
        ) : (
          <p className="text-center py-20 text-espresso-400">
            Nenhum produto encontrado com os filtros selecionados.
          </p>
        )}
      </div>
    </div>
  )
}
