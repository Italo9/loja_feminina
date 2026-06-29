import Link from "next/link"
import { getCategoryImages } from "@/lib/products"

export async function CategorySection() {
  const categories = await getCategoryImages()

  if (categories.length === 0) return null

  return (
    <section className="section-padding bg-pearl-100">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="display-lg text-espresso-900 mb-3">
            Navegue por{" "}
            <span className="text-berry-600 italic font-light">
              categorias
            </span>
          </h2>
          <p className="body-lg max-w-lg mx-auto">
            Encontre exatamente o que procura
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className={`group relative aspect-square rounded-2xl overflow-hidden bg-pearl-200 animate-fade-up stagger-${(i % 8) + 1}`}
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-berry-100 to-sand-200">
                  <span className="text-3xl">✨</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-espresso-950/70 to-transparent">
                <span className="text-white text-sm font-semibold">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
