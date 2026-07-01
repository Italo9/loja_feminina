import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get("productId")
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 })
  }

  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  const { productId, authorName, rating, comment } = await req.json()
  if (!productId || !authorName || !rating || !comment) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: {
      productId,
      authorName,
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment.slice(0, 500),
      approved: false,
    },
  })

  return NextResponse.json({ ok: true, review })
}
