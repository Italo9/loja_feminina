"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "./db"
import { auth } from "./auth"

export async function createProduct(formData: FormData) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

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
  const regions = (formData.get("regions") as string) || ""

  await prisma.product.create({
    data: { name, slug, description, price, compareAt, cost, markup, categoryId, source, supplierId, badge, featured, sku, regions },
  })

  revalidatePath("/admin/produtos")
  redirect("/admin/produtos")
}

export async function updateProductStatus(productId: string, active: boolean) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.product.update({ where: { id: productId }, data: { active } })
  revalidatePath("/admin/produtos")
}

export async function deleteProduct(productId: string) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.product.delete({ where: { id: productId } })
  revalidatePath("/admin/produtos")
}

export async function updateOrderStatus(orderId: string, status: string, trackingCode?: string) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.order.update({
    where: { id: orderId },
    data: { status, ...(trackingCode ? { trackingCode } : {}) },
  })
  revalidatePath("/admin/pedidos")
}

export async function createSupplier(formData: FormData) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

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
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

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
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

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

export async function createCoupon(formData: FormData) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

  const code = (formData.get("code") as string).toUpperCase().trim()
  const type = (formData.get("type") as string) || "percentage"
  const value = parseFloat(formData.get("value") as string)
  const minValue = formData.get("minValue") ? parseFloat(formData.get("minValue") as string) : null
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null
  const active = formData.get("active") === "true"
  const startsAt = formData.get("startsAt") ? new Date(formData.get("startsAt") as string) : null
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null

  await prisma.coupon.create({
    data: { code, type, value, minValue, maxUses, active, startsAt, expiresAt },
  })

  revalidatePath("/admin/cupons")
  redirect("/admin/cupons")
}

export async function updateCoupon(formData: FormData) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

  const id = formData.get("id") as string
  const code = (formData.get("code") as string).toUpperCase().trim()
  const type = (formData.get("type") as string) || "percentage"
  const value = parseFloat(formData.get("value") as string)
  const minValue = formData.get("minValue") ? parseFloat(formData.get("minValue") as string) : null
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null
  const active = formData.get("active") === "true"
  const startsAt = formData.get("startsAt") ? new Date(formData.get("startsAt") as string) : null
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null

  await prisma.coupon.update({
    where: { id },
    data: { code, type, value, minValue, maxUses, active, startsAt, expiresAt },
  })

  revalidatePath("/admin/cupons")
  redirect("/admin/cupons")
}

export async function deleteCoupon(couponId: string) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.coupon.delete({ where: { id: couponId } })
  revalidatePath("/admin/cupons")
}

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } })

  if (!coupon) {
    return { valid: false, discount: 0, type: "", value: 0, error: "Cupom não encontrado." }
  }

  if (!coupon.active) {
    return { valid: false, discount: 0, type: "", value: 0, error: "Cupom inativo." }
  }

  const now = new Date()
  if (coupon.startsAt && now < coupon.startsAt) {
    return { valid: false, discount: 0, type: "", value: 0, error: "Cupom ainda não está disponível." }
  }
  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { valid: false, discount: 0, type: "", value: 0, error: "Cupom expirado." }
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, type: "", value: 0, error: "Cupom esgotado." }
  }

  if (coupon.minValue !== null && subtotal < coupon.minValue) {
    return { valid: false, discount: 0, type: "", value: 0, error: `Pedido mínimo de R$ ${coupon.minValue.toFixed(2)} para usar este cupom.` }
  }

  let discount = 0
  if (coupon.type === "percentage") {
    discount = Math.round(subtotal * (coupon.value / 100) * 100) / 100
  } else {
    discount = Math.min(coupon.value, subtotal)
  }

  return { valid: true, discount, type: coupon.type, value: coupon.value }
}
