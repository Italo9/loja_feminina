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

  // Filter sizes available for selected color
  const _availableSizes = selectedColor
    ? variants.filter(v => v.color === selectedColor && v.stock > 0).map(v => v.size!)
    : sizes

  if (variants.length === 0) return null

  return (
    <div className="space-y-5">
      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-espresso-400 mb-3">
            Cor: <span className="text-espresso-700">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {colors.map(color => {
              const variant = variants.find(v => v.color === color)
              const isSelected = selectedColor === color
              return (
                <button
                  key={color}
                  onClick={() => { setSelectedColor(color); setSelectedSize(null) }}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    isSelected ? "border-berry-500 scale-110 ring-2 ring-berry-200" : "border-pearl-300 hover:border-pearl-400"
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

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-espresso-400 mb-3">Tamanho</p>
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
                  className={`min-w-[44px] h-11 px-3 rounded-xl text-sm font-bold transition-all ${
                    !available
                      ? "bg-pearl-100 text-espresso-300 line-through cursor-not-allowed"
                      : isSelected
                        ? "bg-berry-600 text-white shadow-md"
                        : "bg-white text-espresso-700 border border-pearl-200 hover:border-berry-300"
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
