import { NextResponse } from "next/server"
import { calculateShipping } from "@/lib/shipping"

export async function POST(req: Request) {
  try {
    const { cep, items, subtotal } = await req.json()

    if (!cep || typeof cep !== "string") {
      return NextResponse.json({ error: "CEP é obrigatório" }, { status: 400 })
    }
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items deve ser um array" }, { status: 400 })
    }
    if (typeof subtotal !== "number" || subtotal < 0) {
      return NextResponse.json({ error: "Subtotal inválido" }, { status: 400 })
    }

    const result = await calculateShipping(cep, items, subtotal)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Erro ao calcular frete" }, { status: 500 })
  }
}
