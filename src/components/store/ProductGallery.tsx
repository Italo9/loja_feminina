"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { store } from "@/lib/config"

interface Props {
  images: { id: string; url: string; alt: string | null }[]
  productName: string
}

export function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0)
  const hasMultiple = images.length > 1

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-cream-200 flex items-center justify-center">
        <span className="font-[family-name:var(--font-display)] text-2xl text-cream-400">
          {store.name}
        </span>
      </div>
    )
  }

  return (
    <div>
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-200 mb-3">
        <Image
          src={images[active].url}
          alt={images[active].alt ?? productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {hasMultiple && (
          <>
            <button onClick={() => setActive((active - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-soft hover:bg-white transition-colors">
              <ChevronLeft className="w-4 h-4 text-espresso-600" />
            </button>
            <button onClick={() => setActive((active + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-soft hover:bg-white transition-colors">
              <ChevronRight className="w-4 h-4 text-espresso-600" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-rose-500" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt={img.alt ?? `${productName} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
