"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "./db"

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string || name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const compareAt = formData.get("compareAt") ? parseFloat(formData.get("compareAt") as string) : null
  const categoryId = formData.get("categoryId") as string
  const badge = (formData.get("badge") as string) || null
  const featured = formData.get("featured") === "true"

  await prisma.product.create({
    data: { name, slug, description, price, compareAt, categoryId, badge, featured },
  })

  revalidatePath("/admin/produtos")
  redirect("/admin/produtos")
}

export async function updateProductStatus(productId: string, active: boolean) {
  await prisma.product.update({ where: { id: productId }, data: { active } })
  revalidatePath("/admin/produtos")
}

export async function updateOrderStatus(orderId: string, status: string, trackingCode?: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status, ...(trackingCode ? { trackingCode } : {}) },
  })
  revalidatePath("/admin/pedidos")
}
