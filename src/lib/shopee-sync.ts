"use server"

import { prisma } from "@/lib/db"
import {
  getShopeeAuth,
  getOpenCampaignProducts,
  isFeminineProduct,
  isBrazilianShop,
  enrichProduct,
} from "@/lib/shopee"

interface SyncResult {
  total: number
  filtered: number
  created: number
  updated: number
  errors: number
}

const PORTUGUESE_CATEGORIES: Record<string, string> = {
  vestido: "vestidos",
  vestidos: "vestidos",
  saia: "saias",
  blusa: "blusas",
  blusas: "blusas",
  cropped: "blusas",
  camisa: "blusas",
  camiseta: "blusas",
  calca: "calcas",
  calças: "calcas",
  calça: "calcas",
  shorts: "calcas",
  bermuda: "calcas",
  short: "calcas",
  macacao: "moda-praia",
  macacão: "moda-praia",
  praia: "moda-praia",
  biquini: "moda-praia",
  biquíni: "moda-praia",
  lingerie: "moda-praia",
  acessorio: "acessorios",
  acessórios: "acessorios",
  bolsa: "acessorios",
  bolsas: "acessorios",
  sapato: "acessorios",
  sapatos: "acessorios",
  sandalia: "acessorios",
  sandália: "acessorios",
  casaco: "colecoes",
  jaqueta: "colecoes",
  conjunto: "colecoes",
  colecao: "colecoes",
  coleção: "colecoes",
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

function mapCategory(name: string, categoryName: string): string {
  const lower = (name + " " + categoryName).toLowerCase()
  for (const [key, slug] of Object.entries(PORTUGUESE_CATEGORIES)) {
    if (lower.includes(key)) return slug
  }
  return "vestidos"
}

async function ensureCategory(slug: string): Promise<string> {
  const existing = await prisma.category.findFirst({ where: { slug } })
  if (existing) return existing.id

  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")
  const cat = await prisma.category.create({
    data: { name, slug },
  })
  return cat.id
}

export async function syncShopeeProducts(): Promise<SyncResult> {
  const auth = getShopeeAuth()
  const result: SyncResult = { total: 0, filtered: 0, created: 0, updated: 0, errors: 0 }

  let page = 1
  let hasMore = true
  const maxPages = 3

  while (hasMore && page <= maxPages) {
    try {
      const res = await getOpenCampaignProducts(auth, page, 50)

      if (res.error) {
        result.errors++
        break
      }

      const products = res.response?.list ?? []
      result.total += products.length
      if (products.length < 50) hasMore = false

      for (const sp of products) {
        try {
          if (!isFeminineProduct(sp)) { result.filtered++; continue }
          if (!isBrazilianShop(sp)) { result.filtered++; continue }

          const enriched = enrichProduct(sp)
          const sku = `shopee-${sp.item_id}`
          const categorySlug = mapCategory(sp.product_name, sp.category_name)
          const categoryId = await ensureCategory(categorySlug)
          const slug = `${slugify(sp.product_name)}-${sp.item_id}`

          const existing = await prisma.product.findFirst({ where: { sku } })

          if (existing) {
            await prisma.product.update({
              where: { id: existing.id },
              data: {
                price: enriched.price,
                cost: enriched.originalPrice,
                active: true,
                tags: `affiliate:${enriched.affiliateLink},shopee,${categorySlug}`,
              },
            })
            result.updated++
            continue
          }

          const product = await prisma.product.create({
            data: {
              name: enriched.name.slice(0, 180),
              slug,
              description: enriched.description.slice(0, 500),
              price: enriched.price,
              compareAt: enriched.compareAt,
              cost: enriched.originalPrice,
              markup: 150,
              categoryId,
              source: "dropship",
              badge: "oferta",
              sku,
              tags: `affiliate:${enriched.affiliateLink},shopee,${categorySlug}`,
              active: true,
            },
          })

          const imageUrl = enriched.images[0]
          if (imageUrl) {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                url: imageUrl,
                alt: enriched.name,
                position: 0,
              },
            })
          }

          result.created++
        } catch {
          result.errors++
        }
      }

      page++
    } catch {
      result.errors++
      break
    }
  }

  return result
}
