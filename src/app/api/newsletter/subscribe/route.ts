import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 })
    }

    const normalized = email.trim().toLowerCase()

    const existing = await prisma.newsletter.findUnique({
      where: { email: normalized },
    })

    if (existing) {
      return NextResponse.json({ message: "Você já está cadastrado(a)!" })
    }

    await prisma.newsletter.create({
      data: { email: normalized },
    })

    return NextResponse.json({ message: "Cadastro realizado com sucesso!" })
  } catch {
    return NextResponse.json({ error: "Erro ao processar cadastro." }, { status: 500 })
  }
}
