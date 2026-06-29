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
    <section className="section-padding bg-sand-100">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <a
            href={`https://instagram.com/${store.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-espresso-600 hover:text-berry-600 transition-colors mb-3"
          >
            <Camera className="w-5 h-5" />
            <span className="text-sm font-semibold">
              @{store.instagram}
            </span>
          </a>
          <h2 className="display-lg text-espresso-900 mb-2">
            Siga nosso Instagram
          </h2>
          <p className="body-lg text-espresso-500">
            Looks, lançamentos e bastidores em primeira mão
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MOCK_POSTS.map((post, i) => (
            <a
              key={post.id}
              href={`https://instagram.com/${store.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square rounded-2xl overflow-hidden bg-pearl-200 animate-fade-up stagger-${i + 1}`}
            >
              <img
                src={post.image}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-espresso-950/0 group-hover:bg-espresso-950/20 transition-all flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
