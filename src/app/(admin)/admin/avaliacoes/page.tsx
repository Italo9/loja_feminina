import { prisma } from "@/lib/db"
import Link from "next/link"
import { Star, Check, X, Trash2, MessageSquare } from "lucide-react"
import { ReviewActions } from "./ReviewActions"

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1 className="display-md mb-6">Avaliações</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-plum-300 mx-auto mb-4" />
          <p className="body-base">Nenhuma avaliação pendente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className={`surface p-4 ${r.approved ? "" : "border-rose-300 bg-rose-50/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/produto/${r.product.slug}`} className="text-sm font-medium text-plum-700 hover:text-rose-500">
                      {r.product.name}
                    </Link>
                    {!r.approved && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                        Pendente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-plum-400 mt-0.5">{r.authorName} | {new Date(r.createdAt).toLocaleDateString("pt-BR")}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? "text-gold-400 fill-gold-400" : "text-plum-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-plum-600 mt-2">{r.comment}</p>
                </div>
                <ReviewActions reviewId={r.id} approved={r.approved} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
