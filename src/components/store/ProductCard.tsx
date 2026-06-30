"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Product } from "@/types"

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)

  const mainImage = product.images?.[imgIdx]?.url ?? null
  const secondImage = product.images?.[1]?.url ?? null
  const hasDiscount =
    product.compareAt && product.compareAt > product.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAt! - product.price) / product.compareAt!) * 100,
      )
    : 0

  const badgeLabel =
    product.badge === "novidade"
      ? "Novo"
      : product.badge === "oferta"
        ? `-${discountPercent}%`
        : product.badge === "destaque"
          ? "Destaque"
          : null

  return (
    <div className="group">
      {/* Imagem */}
      <Link
        href={`/produto/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200 mb-4"
        onMouseEnter={() => {
          if (secondImage) setImgIdx(1)
        }}
        onMouseLeave={() => setImgIdx(0)}
      >
        {mainImage && !imgError ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream-200">
            <span className="font-[family-name:var(--font-display)] text-2xl text-cream-400">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Badge */}
        {badgeLabel && (
          <span
            className={`absolute top-3 left-3 ${
              product.badge === "oferta" ? "badge-oferta" : "badge-novidade"
            }`}
          >
            {badgeLabel}
          </span>
        )}

        {/* Favoritar */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setLiked(!liked)
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white shadow-sm"
          aria-label="Favoritar"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked
                ? "fill-rose-500 text-rose-500"
                : "text-espresso-500"
            }`}
          />
        </button>

        {/* Quick add to cart */}
        <button
          onClick={(e) => {
            e.preventDefault()
            window.dispatchEvent(
              new CustomEvent("cart:add", {
                detail: {
                  productId: product.id,
                  variantId: null,
                  name: product.name,
                  image: mainImage,
                  price: product.price,
                  quantity: 1,
                  variantInfo: null,
                  maxStock: 99,
                  source: product.source ?? "own",
                },
              })
            )
            setAdded(true)
            setTimeout(() => setAdded(false), 1500)
          }}
          className={`absolute bottom-3 left-3 right-3 py-3 backdrop-blur-md text-[10px] uppercase tracking-[0.15em] font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-sm ${
            added
              ? "bg-rose-500 text-white"
              : "bg-white/80 text-espresso-700 hover:bg-rose-500 hover:text-white"
          }`}
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {added ? "Adicionado!" : "Adicionar"}
        </button>
      </Link>

      {/* Info */}
      <div className="text-center px-1">
        <p className="text-[10px] uppercase tracking-[0.18em] text-rose-400/80 mb-1.5 font-medium">
          {product.category?.name ?? ""}
        </p>
        <Link href={`/produto/${product.slug}`}>
          <h3 className="font-[family-name:var(--font-display)] text-lg text-espresso-800 leading-snug mb-2 line-clamp-2 hover:text-rose-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 justify-center flex-wrap">
          <span className="price-md text-espresso-700">
            R$ {product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-espresso-400 line-through">
              R$ {product.compareAt!.toFixed(2)}
            </span>
          )}
        </div>

        {product.price > 30 && (
          <p className="text-[11px] text-espresso-400 mt-1">
            ou 3x de R$ {(product.price / 3).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}
