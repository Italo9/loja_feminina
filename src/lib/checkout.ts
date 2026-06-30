"use server"

import { prisma } from "./db"
import { auth } from "./auth"
import { revalidatePath } from "next/cache"
import { createMercadoPagoPreference } from "./mercadopago"
import { validateCoupon } from "./admin-actions"

interface AddressInput {
  receiver: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

interface CartItemInput {
  productId: string
  variantId: string | null
  name: string
  image: string | null
  price: number
  quantity: number
  variantInfo: string | null
  source: string
}

export async function createCheckoutOrder(input: {
  userId?: string
  items: CartItemInput[]
  address: AddressInput
  paymentMethod: string
  shippingCost?: number
  couponCode?: string
  payerEmail?: string
  payerName?: string
  notes?: string
}) {
  const { userId, items, address, paymentMethod, shippingCost = 0, couponCode, payerEmail, payerName, notes } = input

  const session = await auth()
  if (userId && session?.user?.id && userId !== session.user.id) {
    return { ok: false, error: "Usuário não autorizado" }
  }

  if (!items.length) return { ok: false, error: "Carrinho vazio" }

  // Validate prices server-side
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { id: true, price: true, variants: { select: { id: true, price: true } } },
    })
    if (!product) {
      return { ok: false, error: `Produto ${item.productId} não encontrado` }
    }
    const expectedPrice = item.variantId
      ? (product.variants.find(v => v.id === item.variantId)?.price ?? product.price)
      : product.price
    if (Math.abs(item.price - expectedPrice) > 0.01) {
      return { ok: false, error: `Preço do item "${item.name}" não confere` }
    }
  }

  const addressStr = JSON.stringify(address)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  let discount = 0
  let validCouponCode: string | null = null

  if (couponCode) {
    const validation = await validateCoupon(couponCode, subtotal)
    if (validation.valid) {
      discount = validation.discount
      validCouponCode = couponCode.toUpperCase().trim()
    }
  }

  const total = Math.max(subtotal + shippingCost - discount, 0)

  const order = await prisma.order.create({
    data: {
      userId: userId ?? null,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      paymentStatus: "pending",
      shippingAddress: addressStr,
      couponCode: validCouponCode,
      notes: notes ?? null,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          variantInfo: item.variantInfo,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          source: item.source,
        })),
      },
    },
    include: { items: true },
  })

  // Separar itens dropship e estoque próprio
  const dropshipItems = items.filter((i) => i.source === "dropship")
  const ownItems = items.filter((i) => i.source === "own")

  for (const item of ownItems) {
    if (item.variantId) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    }
  }

  // Agrupar dropship por fornecedor e criar DropshipOrder
  if (dropshipItems.length > 0) {
    const productIds = dropshipItems.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, supplierId: true, cost: true },
    })
    const productMap = new Map(products.map((p) => [p.id, p]))

    const bySupplier = new Map<string, { supplierId: string; subtotal: number }>()
    for (const item of dropshipItems) {
      const product = productMap.get(item.productId)
      if (product?.supplierId) {
        const existing = bySupplier.get(product.supplierId)
        const itemTotal = (product.cost ?? 0) * item.quantity
        if (existing) {
          existing.subtotal += itemTotal
        } else {
          bySupplier.set(product.supplierId, {
            supplierId: product.supplierId,
            subtotal: itemTotal,
          })
        }
      }
    }

    for (const [, data] of bySupplier) {
      await prisma.dropshipOrder.create({
        data: {
          orderId: order.id,
          supplierId: data.supplierId,
          subtotal: data.subtotal,
          total: data.subtotal,
          status: "pending",
        },
      })
    }
  }

  if (validCouponCode) {
    await prisma.coupon.update({
      where: { code: validCouponCode },
      data: { usedCount: { increment: 1 } },
    })
  }

  revalidatePath("/admin/pedidos")

  // Criar preferência Mercado Pago
  let initPoint: string | null = null
  try {
    const mp = await createMercadoPagoPreference({
      orderId: order.id,
      items: items.map((item) => ({
        id: item.productId,
        title: item.name,
        description: item.variantInfo ?? undefined,
        pictureUrl: item.image ?? undefined,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      payerEmail,
      payerName,
    })
    initPoint = mp.initPoint ?? null
  } catch {
    // Mercado Pago pode não estar configurado — pedido fica como pendente
  }

  return { ok: true, orderId: order.id, initPoint }
}
