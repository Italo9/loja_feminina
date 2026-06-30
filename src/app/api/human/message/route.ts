import { NextResponse } from "next/server"
import { handleMessage } from "@/lib/whatsapp"

export async function POST(req: Request) {
  const { sessionId, text } = await req.json()
  if (!sessionId || !text?.trim()) {
    return NextResponse.json({ ok: false, error: "dados incompletos" }, { status: 400 })
  }
  const result = await handleMessage(sessionId, text)
  return NextResponse.json(result)
}
