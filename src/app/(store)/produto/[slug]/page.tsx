import { notFound } from "next/navigation"
import { ChevronLeft, Truck, Shield, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { getProductBySlug } from "@/lib/products"
import { store, whatsappUrl } from "@/lib/config"
import { ProductGallery } from "@/components/store/ProductGallery"
import { ProductVariants } from "@/components/store/ProductVariants"
import { AddToCartButton } from "@/components/store/AddToCartButton"

interface Props { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discountPercent = hasDiscount ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100) : 0

  return (
    <div className="bg-pearl-100 min-h-screen">
      <div className="container-narrow py-6">
        <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-espresso-500 hover:text-berry-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Info */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-espresso-400 mb-2">
              {product.category?.name ?? "Produto"}
            </p>
            <h1 className="display-lg text-espresso-900 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-[28px] font-mono font-bold text-espresso-900 tracking-tight">
                R$ {product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-espresso-400 line-through">
                  R$ {product.compareAt!.toFixed(2)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="inline-block bg-topaz-100 text-topaz-800 text-xs font-bold px-2.5 py-1 rounded-full mb-1">
                -{discountPercent}% OFF
              </span>
            )}
            {product.price > 30 && (
              <p className="text-sm text-espresso-500 mt-1 mb-6">
                ou 3x de R$ {(product.price / 3).toFixed(2)} sem juros
              </p>
            )}

            <hr className="rule my-6" />

            {/* Variants */}
            <ProductVariants variants={product.variants} />

            {/* Add to cart */}
            <div className="flex flex-col gap-3 mt-6">
              <AddToCartButton product={product} />
              <a
                href={whatsappUrl(`Oi! Quero saber mais sobre: ${product.name} — ${store.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border-2 border-topaz-400 text-topaz-700 font-bold text-[15px] hover:bg-topaz-50 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Comprar pelo WhatsApp
              </a>
            </div>

            {/* Trust */}
            <div className="flex items-center gap-4 mt-8 text-xs text-espresso-400">
              <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Frete para todo Brasil</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Compra segura</span>
            </div>

            {/* Description */}
            <hr className="rule my-8" />
            <div className="prose prose-sm text-espresso-600">
              <h3 className="display-sm text-espresso-900 mb-3">Descrição</h3>
              <div className="body-base text-espresso-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
