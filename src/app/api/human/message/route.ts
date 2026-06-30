import { NextRequest, NextResponse } from "next/server"
import { relayPost, relayEnabled } from "@/lib/relay"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!relayEnabled()) {
    return NextResponse.json({ ok: false, active: false })
  }
  const result = await relayPost("/message", body)
  if (!result) {
    return NextResponse.json({ ok: false, active: false })
  }
  return NextResponse.json(result)
}
