import { NextResponse } from "next/server"
import { handleEnd } from "@/lib/whatsapp"

export async function POST(req: Request) {
  const { sessionId } = await req.json()
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "dados incompletos" }, { status: 400 })
  }
  const result = await handleEnd(sessionId)
  return NextResponse.json(result)
}
