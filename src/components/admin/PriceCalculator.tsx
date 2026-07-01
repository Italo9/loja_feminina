"use client"

import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"

const DEFAULTS = {
  embalagem: 6,
  etiqueta: 2,
  taxaCartao: 5, // ~3% de R$150
  marketing: 10,
}

export function PriceCalculator() {
  const [cost, setCost] = useState("")
  const [markup, setMarkup] = useState("150")
  const [embalagem, setEmbalagem] = useState(DEFAULTS.embalagem.toString())
  const [etiqueta, setEtiqueta] = useState(DEFAULTS.etiqueta.toString())
  const [taxa, setTaxa] = useState(DEFAULTS.taxaCartao.toString())
  const [marketing, setMarketing] = useState(DEFAULTS.marketing.toString())

  useEffect(() => {
    const costInput = document.querySelector<HTMLInputElement>('[name="cost"]')
    const markupInput = document.querySelector<HTMLInputElement>('[name="markup"]')

    const sync = () => {
      setCost(costInput?.value || "")
      setMarkup(markupInput?.value || "150")
    }

    costInput?.addEventListener("input", sync)
    markupInput?.addEventListener("input", sync)
    sync()

    return () => {
      costInput?.removeEventListener("input", sync)
      markupInput?.removeEventListener("input", sync)
    }
  }, [])

  const c = parseFloat(cost) || 0
  const m = parseFloat(markup) || 0
  const despesas = parseFloat(embalagem) + parseFloat(etiqueta) + parseFloat(taxa) + parseFloat(marketing)
  const totalCusto = c + despesas
  const precoSugerido = totalCusto * (1 + m / 100)

  const format = (v: number) => v.toFixed(2)

  if (!c) return null

  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-cream-50 border border-rose-200 p-5 space-y-3">
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-rose-500">
        <Calculator className="w-3.5 h-3.5" />
        Calculadora de Preço
      </h4>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Embalagem", value: embalagem, set: setEmbalagem },
          { label: "Etiqueta", value: etiqueta, set: setEtiqueta },
          { label: "Taxa cartão", value: taxa, set: setTaxa },
          { label: "Marketing", value: marketing, set: setMarketing },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center gap-2 text-xs text-espresso-500">
            <span className="w-16">{label}</span>
            <span className="text-espresso-300">R$</span>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-20 px-2 py-1.5 rounded-lg bg-white border border-cream-200 text-xs text-espresso-700"
            />
          </label>
        ))}
      </div>

      <div className="space-y-1 pt-2 border-t border-rose-100">
        <div className="flex justify-between text-xs">
          <span className="text-espresso-400">Custo total (peça + despesas)</span>
          <span className="font-bold text-espresso-600">R$ {format(totalCusto)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-espresso-400">Markup ({m}%)</span>
          <span className="text-espresso-500">×{format(1 + m / 100)}</span>
        </div>
        <div className="flex justify-between text-sm pt-1 border-t border-rose-100">
          <span className="font-bold text-espresso-700">Preço sugerido</span>
          <span className="font-bold text-rose-600 text-lg">R$ {format(precoSugerido)}</span>
        </div>
      </div>
    </div>
  )
}
