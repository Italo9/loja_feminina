import { cookies } from "next/headers"

export const REGION_COOKIE = "lumiere_region"

export async function getUserRegionCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(REGION_COOKIE)?.value ?? null
}
