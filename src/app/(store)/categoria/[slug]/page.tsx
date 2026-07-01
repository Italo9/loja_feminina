import Link from "next/link"
import type { Metadata } from "next"
import { getCatalogProducts, getCategories } from "@/lib/products"
import { getUserRegionCookie } from "@/lib/location-server"
import { ProductCard } from "@/components/store/ProductCard"
import { Pagination } from "@/components/store/Pagination"
import { FilterBar } from "@/components/store/FilterBar"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"
import { store } from "@/lib/config"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find(
    (c) => c.slug === slug || c.children?.some((sub) => sub.slug === slug)
  )
  const title = category?.name ?? slug.replace(/-/g, " ")
  return {
    title,
    description: `Confira nossa coleção de ${title.toLowerCase()} na ${store.name}. Peças exclusivas e selecionadas com curadoria especial. ${store.tagline}`,
    openGraph: {
      title: `${title} — ${store.name}`,
      description: store.tagline,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${store.name}`,
      description: store.tagline,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams

  const page = Number(sp.page) || 1
  const sort = (sp.sort as string) || "newest"
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined
  const region = await getUserRegionCookie()

  const [result, allCategories] = await Promise.all([
    getCatalogProducts({ page, perPage: 12, sort, minPrice, maxPrice, categorySlug: slug, region: region ?? undefined }),
    getCategories(),
  ])

  const { products, total, pages: totalPages } = result
  const category = allCategories.find(
    (c) =>
      c.slug === slug ||
      c.children?.some((sub) => sub.slug === slug)
  )

  const currentSearch = new URLSearchParams()
  if (sort !== "newest") currentSearch.set("sort", sort)
  if (minPrice !== undefined) currentSearch.set("minPrice", String(minPrice))
  if (maxPrice !== undefined) currentSearch.set("maxPrice", String(maxPrice))

  const buildHref = (p: number) => {
    const params = new URLSearchParams(currentSearch)
    if (p > 1) params.set("page", String(p))
    else params.delete("page")
    const qs = params.toString()
    return `/categoria/${slug}${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Breadcrumbs items={[{ label: category?.name ?? slug }]} />

        <h1 className="display-lg mb-2">{category?.name ?? slug}</h1>
        {category?.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href={`/categoria/${slug}`}
              className="px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-semibold"
            >
              Todos
            </Link>
            {category.children.map((sub) => (
              <Link
                key={sub.slug}
                href={`/categoria/${sub.slug}`}
                className="px-4 py-2 rounded-full bg-white border border-cream-200 text-espresso-500 text-sm font-medium hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        <FilterBar
          currentSort={sort}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          baseUrl={`/categoria/${slug}`}
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
          <div className="text-center py-20">
            <p className="display-sm mb-2">Nenhum produto encontrado</p>
            <p className="body-base mb-6">
              Esta categoria não tem produtos com os filtros selecionados.
            </p>
            <Link href="/catalogo" className="btn-rose">
              Ver catálogo completo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
