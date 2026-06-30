import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const RELAY_URL = process.env.RELAY_URL
const RELAY_AUTH_TOKEN = process.env.RELAY_AUTH_TOKEN || "change-me"

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId")
  if (!RELAY_URL) {
    return NextResponse.json({ active: false, messages: [], ended: null })
  }

  try {
    const url = `${RELAY_URL}/poll?sessionId=${encodeURIComponent(sessionId ?? "")}&_=${Date.now()}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${RELAY_AUTH_TOKEN}` },
    })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ active: false, messages: [], ended: null })
  }
}
