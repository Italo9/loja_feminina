import type { MetadataRoute } from "next"
import { prisma } from "@/lib/db"
import { store } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = store.url

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      select: { slug: true },
    }),
    prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticPages = [
    "sobre",
    "entrega",
    "trocas",
    "privacidade",
    "favoritos",
    "catalogo",
    "carrinho",
    "cadastro",
    "login",
  ]

  const now = new Date()

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categories.map((c) => ({
      url: `${baseUrl}/categoria/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${baseUrl}/produto/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...staticPages.map((page) => ({
      url: `${baseUrl}/${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ]
}
