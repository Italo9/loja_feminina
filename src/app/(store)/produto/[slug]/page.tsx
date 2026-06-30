import { notFound } from "next/navigation"
import { ChevronLeft, Truck, Shield } from "lucide-react"
import Link from "next/link"
import { getProductBySlug } from "@/lib/products"

import { ProductGallery } from "@/components/store/ProductGallery"
import { ProductVariants } from "@/components/store/ProductVariants"
import { AddToCartButton } from "@/components/store/AddToCartButton"
import { OpenChatButton } from "@/components/store/OpenChatButton"

interface Props { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discountPercent = hasDiscount ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100) : 0

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-6">
        <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>

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
      </div>
    </div>
  )
}
