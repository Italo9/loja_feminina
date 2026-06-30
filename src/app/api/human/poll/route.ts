import { NextResponse, NextRequest } from "next/server"
import { handlePoll } from "@/lib/whatsapp"

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") ?? ""
  const result = handlePoll(sessionId)
  return NextResponse.json(result)
}
