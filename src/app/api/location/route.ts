import { NextResponse } from "next/server"
import { fetchAddressByCep, normalizeCep } from "@/lib/location"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cep = searchParams.get("cep")
  if (!cep) return NextResponse.json({ error: "CEP é obrigatório" }, { status: 400 })

  const clean = normalizeCep(cep)
  if (clean.length !== 8) return NextResponse.json({ error: "CEP inválido" }, { status: 400 })

  const address = await fetchAddressByCep(clean)
  if (!address) return NextResponse.json({ error: "CEP não encontrado" }, { status: 404 })

  return NextResponse.json({
    city: address.city,
    state: address.state,
    cep: clean,
  })
}
