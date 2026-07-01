const CJ_API_BASE = "https://developers.cjdropshipping.com/api2.0/v1"

let cachedToken: string | null = null
let tokenExpiry = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const apiKey = process.env.CJ_API_KEY
  if (!apiKey) throw new Error("CJ_API_KEY not configured")

  const res = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
    signal: AbortSignal.timeout(10000),
  })

  const data = await res.json()
  if (data.code !== 200 || !data.data?.accessToken) {
    throw new Error(`CJ auth failed: ${data.message}`)
  }

  const newToken: string = data.data.accessToken
  cachedToken = newToken
  tokenExpiry = Date.now() + 150 * 24 * 60 * 60 * 1000 // 150 dias
  return newToken
}

export interface CjProduct {
  pid: string
  productNameEn: string
  productSku: string
  productImage: string
  sellPrice: number | string
  listedNum: number
  categoryId: string
  categoryName: string
  deliveryCycle?: string
  description?: string
}

export function parsePrice(price: number | string): number {
  if (typeof price === "number") return price
  const match = String(price).match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

interface CjListResponse {
  code: number
  result: boolean
  message: string
  data: {
    pageNum: number
    pageSize: number
    total: number
    list: CjProduct[]
  }
}

// "Women's Clothing" = só moda feminina
const FEMININE_CATEGORY_WORDS = [
  "women", "woman", "female", "lady", "girl", "ladies",
  "dress", "blouse", "skirt", "shorts", "bikini", "swimwear",
  "lingerie", "bra", "panties", "bodysuit",
  "top", "crop", "jumpsuit", "romper",
  "bag", "purse", "handbag", "clutch",
  "necklace", "earring", "bracelet", "ring", "jewelry",
]

export function isFeminineProduct(product: CjProduct): boolean {
  const text = (product.productNameEn + " " + product.categoryName).toLowerCase()
  return FEMININE_CATEGORY_WORDS.some((w) => text.includes(w))
}

export function applyMarkup(priceUsd: number, markupPercent = 150): number {
  const brlRate = 5.5
  const priceBrl = priceUsd * brlRate
  return Math.round(priceBrl * (1 + markupPercent / 100) * 100) / 100
}

export function estimateDelivery(deliveryCycle?: string): {
  days: number
  text: string
} {
  const match = deliveryCycle?.match(/(\d+)/)
  const baseDays = match ? parseInt(match[1]) : 7
  const buffer = 7
  const total = baseDays + buffer

  return {
    days: total,
    text: `Entrega estimada em ${total} dias úteis`,
  }
}

export function getAffiliateLink(pid: string): string {
  return `https://www.cjdropshipping.com/product/${pid}`
}

export function isCjProduct(tags: string): boolean {
  return tags.includes("cjdropship")
}

export function extractAffiliateLink(tags: string): string | null {
  const match = tags.match(/affiliate:(https?:\/\/[^\s,]+)/)
  return match ? match[1] : null
}

async function cjGet<T>(path: string, params: Record<string, string | number> = {}, retry = true): Promise<T> {
  const token = await getAccessToken()

  const url = new URL(`${CJ_API_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v))
  }

  const res = await fetch(url.toString(), {
    headers: {
      "CJ-Access-Token": token,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(15000),
  })

  const text = await res.text()

  if (!res.ok) throw new Error(`CJ API error ${res.status}: ${text.slice(0, 200)}`)

  const data = JSON.parse(text)

  // Se token expirado/revogado, limpa cache e tenta 1 vez
  if (retry && data.code === 1600001) {
    cachedToken = null
    tokenExpiry = 0
    return cjGet<T>(path, params, false)
  }

  return data
}

export async function getProducts(
  page = 1,
  pageSize = 50,
  keyword?: string,
): Promise<CjListResponse> {
  const params: Record<string, string | number> = {
    pageNum: page,
    pageSize,
    sort: "desc",
    orderBy: "listedNum",
  }
  if (keyword) params.productNameEn = keyword
  return cjGet<CjListResponse>("/product/list", params)
}

export interface EnrichedCjProduct {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  sales: number
  deliveryDays: number
  deliveryText: string
  affiliateLink: string
  source: "cjdropship"
}

export function enrichProduct(product: CjProduct): EnrichedCjProduct {
  const sellPrice = parsePrice(product.sellPrice)
  const markedUpPrice = applyMarkup(sellPrice, 150)
  const delivery = estimateDelivery(product.deliveryCycle)

  return {
    id: `cj-${product.pid}`,
    name: product.productNameEn,
    price: markedUpPrice,
    originalPrice: sellPrice,
    image: product.productImage,
    category: product.categoryName,
    sales: product.listedNum,
    deliveryDays: delivery.days,
    deliveryText: delivery.text,
    affiliateLink: getAffiliateLink(product.pid),
    source: "cjdropship",
  }
}

export interface CjOrderItem {
  pid: string
  quantity: number
  variantId?: string
}

export interface CjShippingAddress {
  name: string
  phone: string
  country: string
  state: string
  city: string
  address: string
  zipCode: string
}

export interface CjCreateOrderRequest {
  items: CjOrderItem[]
  shippingAddress: CjShippingAddress
  remark?: string
}

interface CjOrderResponse {
  code: number
  result: boolean
  message: string
  data: {
    orderId: string
    orderNumber: string
    trackingNumber?: string
  }
}

export async function createCjOrder(
  order: CjCreateOrderRequest,
): Promise<CjOrderResponse> {
  const token = await getAccessToken()
  if (!token) throw new Error("CJ auth failed")

  const res = await fetch(`${CJ_API_BASE}/shopping/createOrder`, {
    method: "POST",
    headers: {
      "CJ-Access-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: order.items.map((i) => ({
        pid: i.pid,
        quantity: i.quantity,
        ...(i.variantId ? { variantId: i.variantId } : {}),
      })),
      shippingAddress: {
        name: order.shippingAddress.name,
        phone: order.shippingAddress.phone,
        country: order.shippingAddress.country || "BR",
        state: order.shippingAddress.state,
        city: order.shippingAddress.city,
        address: order.shippingAddress.address,
        zipCode: order.shippingAddress.zipCode,
      },
      remark: order.remark || "",
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    throw new Error(`CJ createOrder error: ${res.status}`)
  }

  return res.json()
}
