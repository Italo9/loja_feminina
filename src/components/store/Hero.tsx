import { Sparkles, Truck, Shield, CreditCard } from "lucide-react"
import Link from "next/link"
import { store } from "@/lib/config"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-berry-950 via-berry-900 to-espresso-950" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-berry-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-topaz-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative container-narrow py-20 md:py-32">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="text-topaz-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-fade-up">
            Nova Coleção Verão 2026
          </p>

          {/* Headline */}
          <h1 className="display-xl text-white mb-6 animate-fade-up stagger-1">
            Vestidos para{" "}
            <span className="text-topaz-400 italic font-light">
              brilhar
            </span>
          </h1>

          {/* Subtitle */}
          <p className="body-lg text-pearl-200/80 max-w-lg mb-10 animate-fade-up stagger-2">
            Peças exclusivas com curadoria especial. Do casual ao
            sofisticado, cada look conta uma história.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-3">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 bg-topaz-500 hover:bg-topaz-400 text-espresso-950 font-bold px-8 py-3.5 rounded-full text-[15px] transition-all hover:scale-105 active:scale-95"
            >
              Ver Coleção
              <Sparkles className="w-4 h-4" />
            </Link>
            <Link
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-full text-[15px] transition-all border border-white/20"
            >
              Falar no WhatsApp
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6 mt-12 pt-10 border-t border-white/10 animate-fade-up stagger-4">
            {[
              {
                icon: Truck,
                label: store.shippingInfo,
              },
              {
                icon: Shield,
                label: "Compra 100% segura",
              },
              {
                icon: CreditCard,
                label: "Parcele em até 3x",
              },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 text-pearl-300/70"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle decorative line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-topaz-400/30 to-transparent" />
    </section>
  )
}
