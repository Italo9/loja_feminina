"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  images: { id: string; url: string; alt: string | null }[]
  productName: string
}

export function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0)
  const hasMultiple = images.length > 1

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-pearl-200 flex items-center justify-center">
        <span className="display-sm text-berry-300">Jóia</span>
      </div>
    )
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-pearl-200 mb-3">
        <img
          src={images[active].url}
          alt={images[active].alt ?? productName}
          className="w-full h-full object-cover"
        />
        {hasMultiple && (
          <>
            <button onClick={() => setActive((active - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-soft">
              <ChevronLeft className="w-4 h-4 text-espresso-700" />
            </button>
            <button onClick={() => setActive((active + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-soft">
              <ChevronRight className="w-4 h-4 text-espresso-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-berry-500" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt={img.alt ?? `${productName} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
