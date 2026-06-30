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
    <section className="section-padding bg-[#FFF6F2]">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">Siga-nos</p>
          <h2 className="display-md mb-3">
            Nos acompanhe{" "}
            <span className="text-[#C9A66B]">✦</span>
          </h2>
          <p className="body-base text-[#B58FA2]">
            Looks, lançamentos e bastidores em primeira mão
          </p>
          <a
            href={`https://instagram.com/${store.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#C9A66B] hover:text-[#DCA7A7] transition-colors font-medium"
          >
            <Camera className="w-3.5 h-3.5" />
            @{store.instagram}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {MOCK_POSTS.map((post, i) => (
            <a
              key={post.id}
              href={`https://instagram.com/${store.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square overflow-hidden rounded-xl bg-[#F6D8D6]/20 animate-fade-up stagger-${i + 1}`}
            >
              <Image
                src={post.image}
                alt={`Instagram post ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-[#6B4A4F]/0 group-hover:bg-[#6B4A4F]/25 transition-all duration-500 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
