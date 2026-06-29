import { Product } from "@/types"
import { prisma } from "./db"

// Funções de consulta para produtos - usadas pelo storefront e admin

export async function getFeaturedProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: true, variants: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  })
}

export async function getNewProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { active: true },
    include: { images: true, variants: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  })
}

export async function getProductsByCategory(
  slug: string,
): Promise<Product[]> {
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
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true, category: true },
  })
}

export async function getCategories(): Promise<
  { id: string; name: string; slug: string; image: string | null; children: { id: string; name: string; slug: string }[] }[]
> {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { order: "asc" },
  })
}

export async function getCategoryImages(): Promise<
  { id: string; name: string; slug: string; image: string | null }[]
> {
  return prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true, slug: true, image: true },
    orderBy: { order: "asc" },
  })
}
