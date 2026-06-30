import { cache } from "react"
import { Product } from "@/types"
import { prisma } from "./db"

export interface PaginatedResult {
  products: Product[]
  total: number
  pages: number
}

export interface CatalogOptions {
  page?: number
  perPage?: number
  sort?: string
  minPrice?: number
  maxPrice?: number
  categorySlug?: string
}

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: true, variants: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  })
})

export const getCatalogProducts = cache(async (
  options: CatalogOptions = {}
): Promise<PaginatedResult> => {
  const {
    page = 1,
    perPage = 12,
    sort = "newest",
    minPrice,
    maxPrice,
    categorySlug,
  } = options

  const where: Record<string, unknown> = { active: true }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    }
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { children: true },
    })
    if (!category) {
      return { products: [], total: 0, pages: 0 }
    }
    const categoryIds = [
      category.id,
      ...(category.children?.map((c) => c.id) ?? []),
    ]
    where.categoryId = { in: categoryIds }
  }

  let orderBy: Record<string, string>
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" }
      break
    case "price_desc":
      orderBy = { price: "desc" }
      break
    case "name_asc":
      orderBy = { name: "asc" }
      break
    case "newest":
    default:
      orderBy = { createdAt: "desc" }
      break
  }

  const skip = (page - 1) * perPage

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, variants: true, category: true },
      orderBy,
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    pages: Math.ceil(total / perPage),
  }
})

export const getNewProducts = cache(async (): Promise<Product[]> => {
  const result = await getCatalogProducts({ perPage: 12, sort: "newest" })
  return result.products
})

export const getProductsByCategory = cache(async (
  slug: string,
): Promise<Product[]> => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: true },
  })
  if (!category) return []

  const categoryIds = [
    category.id,
    ...(category.children?.map((c) => c.id) ?? []),
  ]

  return prisma.product.findMany({
    where: { active: true, categoryId: { in: categoryIds } },
    include: { images: true, variants: true, category: true },
    orderBy: { createdAt: "desc" },
  })
})

export const getProductBySlug = cache(async (
  slug: string,
): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true, category: true },
  })
})

export const getCategories = cache(async (): Promise<
  { id: string; name: string; slug: string; image: string | null; children: { id: string; name: string; slug: string }[] }[]
> => {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { order: "asc" },
  })
})

export const searchProducts = cache(async (query: string): Promise<Product[]> => {
  if (!query.trim()) return []
  return prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
      ],
    },
    include: { images: true, variants: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
})

export const getRelatedProducts = cache(async (
  productId: string,
  categoryId: string,
  limit: number = 4,
): Promise<Product[]> => {
  return prisma.product.findMany({
    where: {
      active: true,
      categoryId,
      id: { not: productId },
    },
    include: { images: true, variants: true, category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
})

export const getCategoryImages = cache(async (): Promise<
  { id: string; name: string; slug: string; image: string | null }[]
> => {
  return prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true, slug: true, image: true },
    orderBy: { order: "asc" },
  })
})
