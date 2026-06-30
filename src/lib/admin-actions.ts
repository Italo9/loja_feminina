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
  const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : null
  const markup = formData.get("markup") ? parseFloat(formData.get("markup") as string) : 0
  const categoryId = formData.get("categoryId") as string
  const source = (formData.get("source") as string) || "own"
  const supplierId = (formData.get("supplierId") as string) || null
  const badge = (formData.get("badge") as string) || null
  const featured = formData.get("featured") === "true"
  const sku = (formData.get("sku") as string) || null

  await prisma.product.create({
    data: { name, slug, description, price, compareAt, cost, markup, categoryId, source, supplierId, badge, featured, sku },
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

export async function createSupplier(formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string || name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const apiUrl = (formData.get("apiUrl") as string) || null
  const apiKey = (formData.get("apiKey") as string) || null
  const notes = (formData.get("notes") as string) || null

  await prisma.supplier.create({
    data: { name, slug, apiUrl, apiKey, notes },
  })

  revalidatePath("/admin/fornecedores")
  redirect("/admin/fornecedores")
}

export async function updateSupplier(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string || name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const apiUrl = (formData.get("apiUrl") as string) || null
  const apiKey = (formData.get("apiKey") as string) || null
  const notes = (formData.get("notes") as string) || null
  const active = formData.get("active") === "true"

  await prisma.supplier.update({
    where: { id },
    data: { name, slug, apiUrl, apiKey, notes, active },
  })

  revalidatePath("/admin/fornecedores")
  redirect("/admin/fornecedores")
}

export async function updateDropshipOrderStatus(dropshipOrderId: string, status: string, trackingCode?: string, externalId?: string) {
  await prisma.dropshipOrder.update({
    where: { id: dropshipOrderId },
    data: {
      status,
      ...(trackingCode ? { trackingCode } : {}),
      ...(externalId ? { externalId } : {}),
    },
  })
  revalidatePath("/admin/pedidos")
}
