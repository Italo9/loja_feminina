import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const DEFAULTS: Record<string, string> = {
  free_shipping_threshold: "250",
  free_shipping_message: "Frete grátis acima de",
  shipping_info: "Enviamos para todo Brasil",
  whatsapp_number: "5571997006042",
}

export async function GET() {
  const settings = await prisma.setting.findMany()
  const map: Record<string, string> = { ...DEFAULTS }
  for (const s of settings) map[s.key] = s.value
  return NextResponse.json(map)
}

export async function POST(req: Request) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await req.json()
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
  }

  return NextResponse.json({ ok: true })
}
