"use client"

import { Truck, Shield, CreditCard } from "lucide-react"
import Link from "next/link"
import { store, assistant } from "@/lib/config"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-cream-100 to-cream-100">
      {/* Decoração sutil */}
      <div className="absolute top-20 right-0 w-[35rem] h-[35rem] bg-rose-200/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-gold-300/15 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative container-narrow py-20 md:py-32 lg:py-40">
        <div className="max-w-2xl mx-auto text-center">
          <p className="eyebrow mb-6 animate-fade-up">
            Nova Coleção · Verão 2026
          </p>

          <h1 className="display-xl mb-6 animate-fade-up stagger-1">
            Vestir-se é uma forma de{" "}
            <span className="text-gradient-rose italic">brilhar</span>
          </h1>

          <p className="body-lg max-w-lg mx-auto mb-10 animate-fade-up stagger-2">
            Peças exclusivas, curadoria minuciosa e o requinte que cada
            mulher merece. Do casual ao sofisticado, vista a sua história.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
            <Link href="/catalogo" className="btn-rose">
              Ver Coleção
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event("chat:open"))}
              className="btn-outline"
            >
              Falar com a {assistant.name}
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-16 pt-8 border-t border-cream-200 animate-fade-up stagger-4">
          {[
            { icon: Truck, label: store.shippingInfo },
            { icon: Shield, label: "Compra 100% segura" },
            { icon: CreditCard, label: "Parcele em até 3x" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-espresso-400">
              <Icon className="w-4 h-4 text-rose-400" />
              <span className="text-[11px] uppercase tracking-[0.15em] font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
