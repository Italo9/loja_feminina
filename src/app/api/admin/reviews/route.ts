import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { reviewId, approved } = await req.json()
  await prisma.review.update({
    where: { id: reviewId },
    data: { approved },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const reviewId = searchParams.get("id")
  if (!reviewId) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.review.delete({ where: { id: reviewId } })
  return NextResponse.json({ ok: true })
}
