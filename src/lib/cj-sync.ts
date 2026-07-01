"use server"

import { prisma } from "@/lib/db"
import {
  getProducts,
  isFeminineProduct,
  enrichProduct,
} from "@/lib/cj"

interface SyncResult {
  total: number
  filtered: number
  created: number
  updated: number
  errors: number
  messages: string[]
}

const PORTUGUESE_CATEGORIES: Record<string, string> = {
  dress: "vestidos", dresses: "vestidos",
  blouse: "blusas", blouses: "blusas", top: "blusas", tops: "blusas",
  shirt: "blusas", shirts: "blusas", crop: "blusas",
  skirt: "calcas", skirts: "calcas",
  pant: "calcas", pants: "calcas", trouser: "calcas", trousers: "calcas",
  short: "calcas", shorts: "calcas",
  jean: "calcas", jeans: "calcas", legging: "calcas", leggings: "calcas",
  swim: "moda-praia", bikini: "moda-praia", swimwear: "moda-praia", beach: "moda-praia",
  jumpsuit: "moda-praia", romper: "moda-praia", bodysuit: "moda-praia",
  lingerie: "moda-praia", bra: "moda-praia",
  bag: "acessorios", bags: "acessorios", handbag: "acessorios", purse: "acessorios",
  shoe: "acessorios", shoes: "acessorios", sandal: "acessorios", heel: "acessorios",
  necklace: "acessorios", earring: "acessorios", bracelet: "acessorios", ring: "acessorios",
  jewelry: "acessorios", jewel: "acessorios", watch: "acessorios",
  jacket: "colecoes", coat: "colecoes", hoodie: "colecoes", sweater: "colecoes",
  sweatshirt: "colecoes", cardigan: "colecoes",
}

function mapCategory(name: string, categoryName: string): string {
  const lower = (name + " " + categoryName).toLowerCase()
  for (const [key, slug] of Object.entries(PORTUGUESE_CATEGORIES)) {
    if (lower.includes(key)) return slug
  }
  return "vestidos"
}

function slugify(text: string): string {
  return text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "").slice(0, 80)
}

async function ensureCategory(slug: string): Promise<string> {
  const existing = await prisma.category.findFirst({ where: { slug } })
  if (existing) return existing.id
  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")
  const cat = await prisma.category.create({ data: { name, slug } })
  return cat.id
}

export async function syncCjProducts(): Promise<SyncResult> {
  const result: SyncResult = { total: 0, filtered: 0, created: 0, updated: 0, errors: 0, messages: [] }

  const keywords = ["dress", "blouse", "skirt", "bikini", "top women", "bag women", "necklace women"]

  for (const keyword of keywords) {
    let page = 1
    let hasMore = true

    while (hasMore && page <= 2) {
      try {
        const res = await getProducts(page, 30, keyword)
        if (res.code !== 200) { result.errors++; break }

        const products = res.data?.list ?? []
        result.total += products.length
        if (products.length < 30) hasMore = false

        for (const cp of products) {
          try {
            if (!isFeminineProduct(cp)) { result.filtered++; continue }

            const enriched = enrichProduct(cp)
            const sku = `cj-${cp.pid}`
            const categorySlug = mapCategory(cp.productNameEn, cp.categoryName)
            const categoryId = await ensureCategory(categorySlug)
            const slug = `${slugify(cp.productNameEn)}-${cp.pid.slice(0, 8)}`

            const existing = await prisma.product.findFirst({ where: { sku } })

            if (existing) {
              await prisma.product.update({
                where: { id: existing.id },
                data: {
                  price: enriched.price,
                  cost: enriched.originalPrice,
                  active: true,
                  tags: `cjdropship,${categorySlug}`,
                },
              })
              result.updated++
              continue
            }

            const product = await prisma.product.create({
              data: {
                name: enriched.name.slice(0, 180),
                slug,
                description: enriched.deliveryText,
                price: enriched.price,
                cost: enriched.originalPrice,
                markup: 150,
                categoryId,
                source: "dropship",
                badge: enriched.sales > 50 ? "mais-vendido" : "novidade",
                sku,
                tags: `cjdropship,${categorySlug}`,
                active: true,
              },
            })

            if (enriched.image) {
              await prisma.productImage.create({
                data: {
                  productId: product.id,
                  url: enriched.image,
                  alt: enriched.name,
                  position: 0,
                },
              })
            }

            result.created++
          } catch (e) {
            result.errors++
            result.messages.push(`Erro ${cp.pid.slice(-8)}: ${e instanceof Error ? e.message : String(e)}`)
          }
        }

        page++
      } catch (e) {
        result.errors++
        result.messages.push(`Página ${keyword}: ${e instanceof Error ? e.message : String(e)}`)
        break
      }
    }
  }

  return result
}
