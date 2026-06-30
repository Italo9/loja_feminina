"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface FilterBarProps {
  currentSort: string
  currentMinPrice?: number
  currentMaxPrice?: number
  baseUrl: string
  currentSearch: string
}

export function FilterBar({
  currentSort,
  currentMinPrice,
  currentMaxPrice,
  baseUrl,
  currentSearch,
}: FilterBarProps) {
  const router = useRouter()
  const [minPrice, setMinPrice] = useState(
    currentMinPrice !== undefined ? String(currentMinPrice) : ""
  )
  const [maxPrice, setMaxPrice] = useState(
    currentMaxPrice !== undefined ? String(currentMaxPrice) : ""
  )

  const updateUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentSearch)
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined && v !== "" && v !== "newest") {
        params.set(k, v)
      } else {
        params.delete(k)
      }
    }
    params.delete("page")
    const qs = params.toString()
    router.push(`${baseUrl}${qs ? `?${qs}` : ""}`)
  }

  const handlePriceFilter = () => {
    updateUrl({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
  }

  const handleClearPrice = () => {
    setMinPrice("")
    setMaxPrice("")
    updateUrl({ minPrice: undefined, maxPrice: undefined })
  }

  const hasPriceFilter = currentMinPrice !== undefined || currentMaxPrice !== undefined

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-white rounded-xl border border-cream-200">
      <div className="flex flex-col gap-1.5 min-w-[180px]">
        <label
          htmlFor="sort"
          className="text-[10px] uppercase tracking-[0.15em] font-semibold text-espresso-400"
        >
          Ordenar por
        </label>
        <select
          id="sort"
          defaultValue={currentSort}
          className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-cream-50 text-sm text-espresso-700 focus:outline-none focus:border-rose-300"
          onChange={(e) => updateUrl({ sort: e.target.value })}
        >
          <option value="newest">Mais novos</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
          <option value="name_asc">Nome A-Z</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-espresso-400">
          Faixa de preço
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg border border-cream-200 bg-cream-50 text-sm text-espresso-700 focus:outline-none focus:border-rose-300"
          />
          <span className="text-espresso-300">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg border border-cream-200 bg-cream-50 text-sm text-espresso-700 focus:outline-none focus:border-rose-300"
          />
          <button
            onClick={handlePriceFilter}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
          >
            Filtrar
          </button>
          {hasPriceFilter && (
            <button
              onClick={handleClearPrice}
              className="px-3 py-2 rounded-lg border border-cream-200 text-sm text-espresso-400 hover:text-rose-500 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
