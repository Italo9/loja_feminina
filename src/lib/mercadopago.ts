import { MercadoPagoConfig, Preference } from "mercadopago"
import { store } from "./config"

const accessToken = process.env.MP_ACCESS_TOKEN ?? ""

const client = new MercadoPagoConfig({ accessToken })
const preference = new Preference(client)

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000"
const siteBase = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`

interface PreferenceItem {
  id: string
  title: string
  description?: string
  pictureUrl?: string
  categoryId?: string
  quantity: number
  unitPrice: number
}

interface CreatePreferenceInput {
  orderId: string
  items: PreferenceItem[]
  payerEmail?: string
  payerName?: string
}

export async function createMercadoPagoPreference(input: CreatePreferenceInput) {
  const { orderId, items, payerEmail, payerName } = input

  const preferenceData = {
    body: {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? undefined,
        picture_url: item.pictureUrl ?? undefined,
        category_id: "fashion",
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.unitPrice,
      })),
      payer: {
        ...(payerEmail ? { email: payerEmail } : {}),
        ...(payerName ? { name: payerName } : {}),
      },
      back_urls: {
        success: `${siteBase}/pedido/${orderId}/confirmado`,
        failure: `${siteBase}/checkout?status=failure`,
        pending: `${siteBase}/pedido/${orderId}/confirmado`,
      },
      auto_return: "approved",
      external_reference: orderId,
      notification_url: `${siteBase}/api/webhooks/mercadopago`,
      statement_descriptor: store.shortName.slice(0, 22),
    },
  }

  const result = await preference.create(preferenceData)

  return {
    initPoint: result.init_point,
    preferenceId: result.id,
  }
}

export function handleWebhookPayment(payment: {
  id: number
  external_reference?: string
  status?: string
  status_detail?: string
}) {
  return {
    orderId: payment.external_reference ?? null,
    status: payment.status ?? null,
    detail: payment.status_detail ?? null,
  }
}
