"use server"

import { prisma } from "./db"
import { revalidatePath } from "next/cache"
import { createMercadoPagoPreference } from "./mercadopago"

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
  payerEmail?: string
  payerName?: string
  notes?: string
}) {
  const { userId, items, address, paymentMethod, payerEmail, payerName, notes } = input

  if (!items.length) return { ok: false, error: "Carrinho vazio" }

  const addressStr = JSON.stringify(address)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shippingCost = 0
  const total = subtotal + shippingCost

  const order = await prisma.order.create({
    data: {
      userId: userId ?? null,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      paymentStatus: "pending",
      shippingAddress: addressStr,
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
    const bySupplier = new Map<string, { supplierId: string; subtotal: number }>()
    for (const item of dropshipItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { supplierId: true, cost: true },
      })
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
