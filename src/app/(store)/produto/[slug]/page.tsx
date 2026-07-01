import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Truck, Shield } from "lucide-react"
import { prisma } from "@/lib/db"
import { getProductBySlug, getRelatedProducts } from "@/lib/products"
import { store } from "@/lib/config"

import { ProductGallery } from "@/components/store/ProductGallery"
import { ProductVariants } from "@/components/store/ProductVariants"
import { AddToCartButton } from "@/components/store/AddToCartButton"
import { StickyAddToCart } from "@/components/store/StickyAddToCart"
import { OpenChatButton } from "@/components/store/OpenChatButton"
import { ProductCard } from "@/components/store/ProductCard"
import { ProductJsonLd } from "@/components/store/JsonLd"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export const dynamic = "force-dynamic"

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  const title = `${product.name} — ${store.name}`
  const description = product.description.slice(0, 160)
  const firstImage = product.images?.[0]?.url

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: firstImage ? [{ url: firstImage }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product.id, product.categoryId, 4)

  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discountPercent = hasDiscount ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100) : 0

  const imageUrls = product.images?.map((img) => img.url) ?? []

  return (
    <div className="bg-cream-100 min-h-screen">
      <ProductJsonLd
        name={product.name}
        description={product.description}
        images={imageUrls}
        price={product.price}
        slug={product.slug}
      />
      <div className="container-narrow py-6">
        <Breadcrumbs items={[
          { label: "Catálogo", href: "/catalogo" },
          { label: product.category?.name ?? "Produto", href: product.category?.slug ? `/categoria/${product.category.slug}` : undefined },
          { label: product.name },
        ]} />

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500/80 mb-2">
              {product.category?.name ?? "Produto"}
            </p>
            <h1 className="display-lg mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="price-lg text-espresso-800">
                R$ {product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-base text-espresso-400 line-through">
                  R$ {product.compareAt!.toFixed(2)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="badge-oferta inline-block mb-1">
                -{discountPercent}% OFF
              </span>
            )}
            {product.price > 30 && (
              <p className="text-sm text-espresso-400 mt-1 mb-6">
                ou 3x de R$ {(product.price / 3).toFixed(2)} sem juros
              </p>
            )}

            <hr className="rule my-6" />

            <ProductVariants variants={product.variants} />

            <div className="flex flex-col gap-3 mt-6">
              <AddToCartButton product={product} />
              <OpenChatButton label="Falar com a Jade" />
            </div>

            <div className="flex items-center gap-4 mt-8 text-xs text-espresso-400">
              <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-rose-400" /> Frete para todo Brasil</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-rose-400" /> Compra segura</span>
            </div>

            <hr className="rule my-8" />
            <div>
              <h3 className="display-sm mb-3">Descrição</h3>
              <div className="body-base leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <>
            <hr className="rule my-12" />
            <section>
              <h3 className="display-sm mb-6">Produtos relacionados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <StickyAddToCart product={product} />
    </div>
  )
}
