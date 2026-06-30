import type { Metadata } from "next"
import { Hero } from "@/components/store/Hero"
import { ProductSection } from "@/components/store/ProductSection"
import { CategorySection } from "@/components/store/CategorySection"
import { InstagramSection } from "@/components/store/InstagramSection"
import { TestimonialsSection } from "@/components/store/TestimonialsSection"
import { NewsletterForm } from "@/components/store/NewsletterForm"
import { getFeaturedProducts, getNewProducts } from "@/lib/products"
import { store } from "@/lib/config"
import { Truck, Shield, CreditCard } from "lucide-react"

export const metadata: Metadata = {
  title: `${store.name} — ${store.tagline}`,
  description: store.description,
  openGraph: {
    title: `${store.name} — ${store.tagline}`,
    description: store.description,
    type: "website",
  },
}

export default async function HomePage() {
  const [featured, newProducts] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getNewProducts().catch(() => []),
  ])

  return (
    <>
      <Hero />

      {/* Novidades */}
      <ProductSection
        title="Novidades"
        subtitle="Acabaram de chegar"
        products={newProducts}
        href="/catalogo?ordem=novidades"
      />

      <hr className="hairline-gold max-w-[200px] mx-auto my-0" />

      {/* Mais desejados */}
      <ProductSection
        title="Mais desejados"
        subtitle="As preferidas"
        products={featured}
        href="/catalogo?ordem=destaque"
      />

      <hr className="hairline-gold max-w-[200px] mx-auto my-0" />

      {/* Coleções */}
      <CategorySection />

      <hr className="hairline-gold max-w-[200px] mx-auto my-0" />

      {/* Microcopy */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-narrow text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl italic text-[#6B4A4F]/70 leading-relaxed">
            Escolhas feitas para mulheres que brilham naturalmente.
          </p>
          <span className="inline-block mt-5 text-gold-400 text-lg">✦</span>
        </div>
      </section>

      <hr className="hairline-gold max-w-[200px] mx-auto my-0" />

      {/* Depoimentos */}
      <TestimonialsSection />

      <hr className="hairline-gold max-w-[200px] mx-auto my-0" />

      {/* Benefícios */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <p className="eyebrow mb-4">Por que escolher a {store.name}</p>
            <h2 className="display-lg">
              Cada detalhe{" "}
              <span className="italic text-gradient-rose">pensado</span> em você
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Truck,
                title: store.shippingInfo,
                desc: "Entrega rápida e rastreável com todo o cuidado que suas peças merecem.",
              },
              {
                icon: Shield,
                title: "Compra 100% segura",
                desc: "Seus dados protegidos. Pagamento via Mercado Pago com total segurança e privacidade.",
              },
              {
                icon: CreditCard,
                title: "Parcele em até 3x",
                desc: "Facilidade no pagamento para você brilhar sem pesar no bolso.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`text-center surface p-8 animate-fade-up stagger-${i + 1}`}
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-medium text-[#6B4A4F] mb-2">
                  {title}
                </h3>
                <p className="body-sm text-[#6B4A4F]/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="hairline-gold max-w-[200px] mx-auto my-0" />

      {/* Instagram */}
      <InstagramSection />

      <hr className="hairline-gold max-w-[200px] mx-auto my-0" />

      {/* Newsletter */}
      <section className="section-padding bg-[#FFF6F2] pb-28 md:pb-36">
        <div className="container-narrow text-center max-w-lg">
          <p className="eyebrow mb-4">Fique por dentro</p>
          <h2 className="display-md mb-3">
            Receba novidades
          </h2>
          <p className="body-lg mb-2">
            Ofertas exclusivas e lançamentos em primeira mão.
          </p>
          <p className="text-[11px] text-[#6B4A4F]/40 mb-6 tracking-[0.1em] uppercase">
            Direto no seu e-mail ✦ sem spam
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
