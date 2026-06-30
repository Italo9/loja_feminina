import { NextResponse } from "next/server"
import { handleStart } from "@/lib/whatsapp"

export async function POST(req: Request) {
  const { sessionId, name } = await req.json()
  if (!sessionId || !name?.trim()) {
    return NextResponse.json({ ok: false, error: "dados incompletos" }, { status: 400 })
  }
  const result = await handleStart(sessionId, name)
  return NextResponse.json(result)
}
