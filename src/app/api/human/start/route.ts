import { NextResponse } from "next/server"
import { handleStart } from "@/lib/whatsapp"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown"
  if (!checkRateLimit(`human:${ip}`, 30, 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Muitas requisições. Aguarde um momento." }, { status: 429 })
  }

  const { sessionId, name } = await req.json()
  if (!sessionId || !name?.trim()) {
    return NextResponse.json({ ok: false, error: "dados incompletos" }, { status: 400 })
  }
  const result = await handleStart(sessionId, name)
  return NextResponse.json(result)
}
