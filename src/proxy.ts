import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/api")) {
    return NextResponse.next()
  }

  const session = await auth()
  const role = (session?.user as { role?: string })?.role

  if (role !== "ADMIN") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
