import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { syncShopeeProducts } from "@/lib/shopee-sync"

export async function POST() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const result = await syncShopeeProducts()
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 },
    )
  }
}
