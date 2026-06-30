import Image from "next/image"
import Link from "next/link"
import { getCategoryImages } from "@/lib/products"

export async function CategorySection() {
  const categories = await getCategoryImages()

  if (categories.length === 0) return null

  return (
    <section className="section-padding bg-cream-50">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">Explore</p>
          <h2 className="display-lg">
            Navegue por{" "}
            <span className="italic text-gradient-rose">categorias</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200 animate-fade-up stagger-${(i % 8) + 1}`}
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cream-200">
                  <span className="text-2xl text-rose-300">✦</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-800/60 via-espresso-800/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <span className="font-[family-name:var(--font-display)] text-base md:text-lg text-white group-hover:text-rose-200 transition-colors">
                  {cat.name}
                </span>
                <span className="block mx-auto mt-2 w-6 h-px bg-rose-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
