import Image from "next/image"
import Link from "next/link"
import { getCategoryImages } from "@/lib/products"

export async function CategorySection() {
  const categories = await getCategoryImages()

  if (categories.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <p className="eyebrow mb-4">Explore</p>
          <h2 className="display-lg">
            Navegue por{" "}
            <span className="italic text-gradient-rose">categorias</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-100 animate-fade-up stagger-${(i % 8) + 1} transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg`}
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cream-100">
                  <span className="text-2xl text-gold-300">✦</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 pb-5 text-center">
                <span className="font-[family-name:var(--font-display)] text-lg md:text-xl text-plum-700 group-hover:text-rose-500 transition-colors">
                  {cat.name}
                </span>
                <span className="block mx-auto mt-2 w-8 h-0.5 bg-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
