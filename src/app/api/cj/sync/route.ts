import { NextResponse } from "next/server"
import { syncCjProducts } from "@/lib/cj-sync"

export async function POST() {
  try {
    const result = await syncCjProducts()
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 },
    )
  }
}
