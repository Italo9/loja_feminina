import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { productId, categoryId } = await req.json()
  if (!productId || !categoryId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  await prisma.product.update({
    where: { id: productId },
    data: { categoryId },
  })

  return NextResponse.json({ ok: true })
}
