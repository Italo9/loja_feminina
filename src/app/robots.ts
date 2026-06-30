import type { MetadataRoute } from "next"
import { store } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/*", "/api/*"],
    },
    sitemap: `${store.url}/sitemap.xml`,
  }
}
