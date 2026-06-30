"use client"

import { useState } from "react"

interface Variant {
  id: string
  color: string | null
  colorHex: string | null
  size: string | null
  stock: number
  price: number | null
}

interface Props {
  variants: Variant[]
}

export function ProductVariants({ variants }: Props) {
  const colors = [...new Set(variants.filter(v => v.color).map(v => v.color!))]
  const sizes = [...new Set(variants.filter(v => v.size).map(v => v.size!))]
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  if (variants.length === 0) return null

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-plum-600 mb-3 font-[family-name:var(--font-body)]">
            Cor: <span className="text-plum-800">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {colors.map(color => {
              const variant = variants.find(v => v.color === color)
              const isSelected = selectedColor === color
              return (
                <button
                  key={color}
                  onClick={() => { setSelectedColor(color); setSelectedSize(null) }}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-gold-400 ring-2 ring-gold-200 scale-110"
                      : "border-cream-300 hover:border-cream-400"
                  }`}
                  style={{ backgroundColor: variant?.colorHex ?? "#ccc" }}
                  aria-label={color}
                  title={color}
                />
              )
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-plum-600 mb-3 font-[family-name:var(--font-body)]">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const variant = variants.find(v => v.size === size && (!selectedColor || v.color === selectedColor))
              const available = variant ? variant.stock > 0 : false
              const isSelected = selectedSize === size
              return (
                <button
                  key={size}
                  onClick={() => available && setSelectedSize(size)}
                  disabled={!available}
                  className={`min-w-[48px] h-11 px-4 rounded-xl text-sm font-medium transition-all ${
                    !available
                      ? "bg-cream-50 text-cream-300 cursor-not-allowed"
                      : isSelected
                        ? "bg-blush-400 text-white shadow-sm"
                        : "bg-white text-plum-600 border border-cream-200 hover:border-blush-300"
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
