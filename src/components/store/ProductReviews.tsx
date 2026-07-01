"use client"

import { useState, useEffect } from "react"
import { Star, Send, Loader2, MessageSquare } from "lucide-react"

interface Review {
  id: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !comment.trim()) return
    setSubmitting(true)
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, authorName, rating, comment }),
    })
    if (res.ok) {
      setSubmitted(true)
      setAuthorName("")
      setComment("")
      setRating(5)
    }
    setSubmitting(false)
  }

  return (
    <div className="mt-12">
      <h3 className="display-sm mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-rose-400" />
        Avaliações ({reviews.length})
      </h3>

      <form onSubmit={handleSubmit} className="surface p-5 mb-6">
        <p className="text-sm font-medium text-plum-600 mb-3">Deixe sua avaliação</p>
        {submitted ? (
          <p className="text-sm text-green-600">Obrigada! Sua avaliação será revisada e publicada em breve. ✨</p>
        ) : (
          <div className="space-y-3">
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-2.5 rounded-xl bg-pearl-50 border border-pearl-200 text-[16px] text-plum-700 placeholder:text-plum-300"
              required
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)}>
                  <Star className={`w-5 h-5 ${s <= rating ? "text-gold-400 fill-gold-400" : "text-plum-200"}`} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência com esta peça..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-pearl-50 border border-pearl-200 text-[16px] text-plum-700 placeholder:text-plum-300 resize-none"
              required
            />
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar
            </button>
          </div>
        )}
      </form>

      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-plum-300" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-plum-400 text-center py-8">Nenhuma avaliação ainda. Seja a primeira!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="surface p-4">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "text-gold-400 fill-gold-400" : "text-plum-200"}`} />
                ))}
              </div>
              <p className="text-sm text-plum-600">{r.comment}</p>
              <p className="text-xs text-plum-400 mt-2">{r.authorName} | {new Date(r.createdAt).toLocaleDateString("pt-BR")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
