import { Hero } from "@/components/store/Hero"
import { ProductSection } from "@/components/store/ProductSection"
import { CategorySection } from "@/components/store/CategorySection"
import { InstagramSection } from "@/components/store/InstagramSection"
import { TestimonialsSection } from "@/components/store/TestimonialsSection"
import { getFeaturedProducts, getNewProducts } from "@/lib/products"

export default async function HomePage() {
  const [featured, newProducts] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getNewProducts().catch(() => []),
  ])

  return (
    <>
      <Hero />

      {/* Categorias */}
      <CategorySection />

      {/* Produtos em destaque */}
      <ProductSection
        title="Queridinhos"
        subtitle="As peças mais amadas pelas nossas clientes"
        products={featured}
        href="/catalogo?ordem=destaque"
      />

      {/* Novidades */}
      <ProductSection
        title="Novidades"
        subtitle="Acabaram de chegar"
        products={newProducts}
        href="/catalogo?ordem=novidades"
      />

      {/* Depoimentos */}
      <TestimonialsSection />

      {/* Instagram */}
      <InstagramSection />

      {/* Newsletter prompt */}
      <section className="section-padding bg-rose-50 pb-24 md:pb-32">
        <div className="container-narrow text-center max-w-lg">
          <p className="eyebrow mb-4">Novidades</p>
          <h2 className="display-md mb-3">
            Fique por dentro
          </h2>
          <p className="body-lg mb-6">
            Cadastre-se e receba ofertas exclusivas em primeira mão.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-5 py-3.5 rounded-full bg-white border border-cream-200 text-espresso-700 placeholder:text-espresso-300 text-[16px] focus:outline-none focus:border-rose-300 shadow-sm transition-colors"
            />
            <button type="submit" className="btn-rose">
              Cadastrar
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
