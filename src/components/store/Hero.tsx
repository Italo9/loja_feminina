"use client"

import { Truck, Shield, CreditCard } from "lucide-react"
import Link from "next/link"
import { store, assistant } from "@/lib/config"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFF6F2]">
      {/* Decorative floating elements */}
      <span className="absolute top-[12%] left-[8%] text-gold-400/25 text-2xl animate-float pointer-events-none select-none">✦</span>
      <span className="absolute top-[28%] right-[10%] text-rose-200/40 text-xl animate-float pointer-events-none select-none" style={{ animationDelay: "1.2s" }}>♡</span>
      <span className="absolute bottom-[22%] left-[14%] text-gold-400/20 text-lg animate-float pointer-events-none select-none" style={{ animationDelay: "2.4s" }}>✦</span>
      <span className="absolute bottom-[32%] right-[8%] text-rose-200/35 text-base animate-float pointer-events-none select-none" style={{ animationDelay: "3s" }}>♡</span>
      <span className="absolute top-[45%] left-[5%] text-gold-400/15 text-sm animate-float pointer-events-none select-none" style={{ animationDelay: "1.8s" }}>✦</span>
      <span className="absolute top-[55%] right-[5%] text-rose-200/25 text-sm animate-float pointer-events-none select-none" style={{ animationDelay: "0.6s" }}>♡</span>

      {/* Ambient glow */}
      <div className="absolute top-20 right-0 w-[35rem] h-[35rem] bg-rose-100/30 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-gold-200/15 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative container-narrow py-16 md:py-36 lg:py-44 text-center">
        <p className="eyebrow mb-4 md:mb-5 animate-fade-up tracking-[0.28em]">
          Luz que vem de você <span className="text-rose-400">♡</span>
        </p>

        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,7vw,6rem)] md:text-[clamp(2.8rem,7vw,6rem)] font-medium leading-[1.02] tracking-[-0.01em] text-[#6B4A4F] mb-3 md:mb-5 animate-fade-up stagger-1">
          {store.name}
        </h1>

        <p className="body-lg max-w-md mx-auto mb-6 md:mb-10 animate-fade-up stagger-2 text-[#6B4A4F]/50">
          {store.tagline}
        </p>

        {/* Gold accent divider */}
        <div className="hairline-gold max-w-[160px] mx-auto mb-6 md:mb-10 animate-fade-up stagger-3" />

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-up stagger-4">
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

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-10 gap-y-3 md:gap-y-4 mt-12 md:mt-20 pt-6 md:pt-8 border-t border-gold-400/15 animate-fade-up stagger-5">
          {[
            { icon: Truck, label: store.shippingInfo },
            { icon: Shield, label: "Compra 100% segura" },
            { icon: CreditCard, label: "Parcele em até 3x" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-[#6B4A4F]/45">
              <Icon className="w-4 h-4 text-gold-400/70" />
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
