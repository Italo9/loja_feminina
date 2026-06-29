"use client"

import { useState } from "react"
import { Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Product } from "@/types"

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

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
    <div className="group animate-fade-up">
      {/* Image */}
      <Link
        href={`/produto/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-pearl-200 mb-3"
        onMouseEnter={() => {
          if (secondImage) setImgIdx(1)
        }}
        onMouseLeave={() => setImgIdx(0)}
      >
        {mainImage && !imgError ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-berry-100 to-pearl-200">
            <span className="display-sm text-berry-300">Jóia</span>
          </div>
        )}

        {/* Badge */}
        {badgeLabel && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              product.badge === "oferta"
                ? "bg-topaz-500 text-espresso-950"
                : "bg-berry-600 text-white"
            }`}
          >
            {badgeLabel}
          </span>
        )}

        {/* Like button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setLiked(!liked)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center transition-all hover:bg-white"
          aria-label="Favoritar"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked
                ? "fill-berry-500 text-berry-500"
                : "text-espresso-500"
            }`}
          />
        </button>

        {/* Quick add - mobile touch */}
        <button
          onClick={(e) => {
            e.preventDefault()
            // TODO: adicionar ao carrinho
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center transition-all hover:bg-berry-600 hover:text-white md:opacity-0 md:group-hover:opacity-100"
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </Link>

      {/* Info */}
      <div className="px-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-espresso-400 mb-1">
          {product.category?.name ?? ""}
        </p>
        <Link href={`/produto/${product.slug}`}>
          <h3 className="text-[15px] font-semibold text-espresso-900 leading-snug mb-1.5 line-clamp-2 hover:text-berry-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="price-md text-espresso-900">
            R$ {product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-espresso-400 line-through">
              R$ {product.compareAt!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Parcelamento */}
        {product.price > 30 && (
          <p className="text-[11px] text-espresso-400 mt-0.5">
            ou 3x de R$ {(product.price / 3).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}
