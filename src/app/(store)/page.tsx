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
      <section className="section-padding bg-gradient-to-br from-berry-700 to-berry-900 text-white">
        <div className="container-narrow text-center max-w-lg">
          <h2 className="display-md mb-3 text-white">
            Fique por dentro
          </h2>
          <p className="body-lg text-berry-100 mb-6">
            Cadastre-se e receba ofertas exclusivas em primeira mão.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-berry-200 text-[16px] focus:outline-none focus:ring-2 focus:ring-topaz-400"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-topaz-500 hover:bg-topaz-400 text-espresso-950 font-bold text-[15px] transition-all active:scale-95"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
