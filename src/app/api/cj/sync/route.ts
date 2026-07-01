import { NextResponse } from "next/server"
import { syncCjProducts } from "@/lib/cj-sync"

export async function POST() {
  try {
    const result = await syncCjProducts()
    const preview = { ...result, messages: result.messages.slice(0, 10) }
    return NextResponse.json(preview)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 },
    )
  }
}
