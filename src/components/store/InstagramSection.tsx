import Image from "next/image"
import { Camera } from "lucide-react"
import { store } from "@/lib/config"

const MOCK_POSTS = [
  { id: "1", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80" },
  { id: "2", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" },
  { id: "3", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80" },
  { id: "4", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80" },
]

export function InstagramSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <p className="eyebrow mb-4">Siga-nos</p>
          <h2 className="display-lg mb-3">
            <span className="italic text-gradient-rose">@{store.instagram}</span>
          </h2>
          <p className="body-lg">
            Looks, lançamentos e bastidores em primeira mão
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MOCK_POSTS.map((post, i) => (
            <a
              key={post.id}
              href={`https://instagram.com/${store.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square overflow-hidden rounded-2xl bg-cream-200 animate-fade-up stagger-${i + 1}`}
            >
              <Image
                src={post.image}
                alt={`Instagram post ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-espresso-800/0 group-hover:bg-espresso-800/40 transition-all duration-300 flex items-center justify-center">
                <Camera className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
