import { NextResponse } from "next/server"
import { validateCoupon } from "@/lib/admin-actions"

export async function POST(request: Request) {
  const { code, subtotal } = await request.json()

  if (!code || typeof subtotal !== "number") {
    return NextResponse.json({ valid: false, discount: 0, type: "", value: 0, error: "Dados inválidos." }, { status: 400 })
  }

  const result = await validateCoupon(code, subtotal)
  return NextResponse.json(result)
}
