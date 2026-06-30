import { NextResponse } from "next/server"
import { getQR } from "@/lib/whatsapp"

export async function GET() {
  return NextResponse.json(getQR())
}
