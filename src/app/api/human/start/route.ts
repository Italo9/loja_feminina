import { NextRequest, NextResponse } from "next/server"
import { relayPost, relayEnabled } from "@/lib/relay"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!relayEnabled()) {
    return NextResponse.json({ ok: false, enabled: false })
  }
  const result = await relayPost("/start", body)
  if (!result) {
    return NextResponse.json({ ok: false, enabled: false })
  }
  return NextResponse.json(result)
}
