const SHOPEE_API_BASE = "https://open-api.affiliate.shopee.com.br/api/v2"

interface ShopeeAuth {
  partnerId: string
  secretKey: string
}

async function generateSign(
  auth: ShopeeAuth,
  path: string,
): Promise<{ sign: string; timestamp: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const raw = auth.partnerId + timestamp + path + auth.secretKey
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(auth.secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(raw))
  const sign = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return { sign, timestamp }
}

async function apiGet(
  auth: ShopeeAuth,
  path: string,
  params: Record<string, string | number> = {},
) {
  const { sign, timestamp } = await generateSign(auth, path)
  const url = new URL(`${SHOPEE_API_BASE}${path}`)
  url.searchParams.set("partner_id", auth.partnerId)
  url.searchParams.set("timestamp", timestamp)
  url.searchParams.set("sign", sign)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v))
  }
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Shopee API error: ${res.status}`)
  return res.json()
}

export interface ShopeeProduct {
  item_id: number
  product_name: string
  product_image: string
  product_price: number
  product_discount_price: number
  sales: number
  shop_name: string
  shop_location: string
  category_name: string
  category_id: number
  commission_rate: string
  link: string
  image_url_list: string[]
  min_price: number
  max_price: number
}

export interface ShopeeCampaignResponse {
  request_id: string
  error: string
  message: string
  response: {
    total_count: number
    list: ShopeeProduct[]
  }
}

export function getShopeeAuth(): ShopeeAuth {
  const partnerId = process.env.SHOPEE_PARTNER_ID
  const secretKey = process.env.SHOPEE_SECRET_KEY
  if (!partnerId || !secretKey) throw new Error("Shopee credentials not configured")
  return { partnerId, secretKey }
}

export async function getOpenCampaignProducts(
  auth: ShopeeAuth,
  pageNo = 1,
  pageSize = 50,
): Promise<ShopeeCampaignResponse> {
  return apiGet(auth, "/ams/get_open_campaign_added_product", {
    page_no: pageNo,
    page_size: pageSize,
  })
}

// Categorias femininas da Shopee (IDs aproximados | ajustar conforme API)
const FEMININE_CATEGORIES = [
  "Vestidos",
  "Blusas",
  "Saias",
  "Calças",
  "Shorts",
  "Macacão",
  "Moda Praia",
  "Lingerie",
  "Acessórios",
  "Bolsas",
  "Calçados",
  "Roupas",
  "Feminino",
  "Feminina",
  "Moda",
  "Mulher",
  "Cropped",
  "Body",
  "Conjunto",
  "Casacos",
  "Jaquetas",
]

const FEMININE_KEYWORDS = FEMININE_CATEGORIES.map((c) => c.toLowerCase())

export function isFeminineProduct(product: ShopeeProduct): boolean {
  const name = product.product_name.toLowerCase()
  const category = product.category_name.toLowerCase()
  return FEMININE_KEYWORDS.some(
    (kw) => name.includes(kw) || category.includes(kw),
  )
}

export function isBrazilianShop(product: ShopeeProduct): boolean {
  const loc = product.shop_location.toLowerCase()
  return (
    loc.includes("br") ||
    loc.includes("brasil") ||
    loc.includes("brazil") ||
    loc.includes("são paulo") ||
    loc.includes("rio de janeiro") ||
    loc.includes("minas gerais") ||
    loc.includes("bahia") ||
    loc.includes("paraná") ||
    loc.includes("santa catarina") ||
    loc.includes("distrito federal") ||
    loc.includes("ceará") ||
    loc.includes("pernambuco") ||
    loc.includes("espírito santo") ||
    loc.includes("goiás") ||
    loc.includes("rio grande do sul") ||
    loc.includes("pará") ||
    loc.includes("amazonas") ||
    loc.includes("maranhão") ||
    loc.includes("paraíba") ||
    loc.includes("rio grande do norte") ||
    loc.includes("alagoas") ||
    loc.includes("sergipe") ||
    loc.includes("piauí") ||
    loc.includes("mato grosso") ||
    loc.includes("mato grosso do sul") ||
    loc.includes("rondônia") ||
    loc.includes("tocantins") ||
    loc.includes("amapá") ||
    loc.includes("roraima") ||
    loc.includes("acre")
  )
}

export function applyMarkup(price: number, markupPercent = 150): number {
  return Math.round(price * (1 + markupPercent / 100) * 100) / 100
}

export function estimateDelivery(shopLocation: string): {
  days: number
  text: string
} {
  // Estimativa base + gordura
  const baseDelivery = 7 // dias base da Shopee
  const buffer = 5 // gordura extra
  const total = baseDelivery + buffer

  return {
    days: total,
    text: `Entrega estimada em ${total} dias úteis. Enviado direto de ${shopLocation}.`,
  }
}

export interface EnrichedProduct {
  id: string
  shopeeId: number
  name: string
  description: string
  price: number
  originalPrice: number
  compareAt: number | null
  image: string
  images: string[]
  shopName: string
  shopLocation: string
  category: string
  sales: number
  commissionRate: string
  deliveryDays: number
  deliveryText: string
  affiliateLink: string
  source: "shopee"
}

export function enrichProduct(product: ShopeeProduct): EnrichedProduct {
  const price = product.product_discount_price > 0
    ? product.product_discount_price
    : product.product_price

  const markedUpPrice = applyMarkup(price, 150)
  const delivery = estimateDelivery(product.shop_location)

  return {
    id: `shopee-${product.item_id}`,
    shopeeId: product.item_id,
    name: product.product_name,
    description: `Produto da loja ${product.shop_name} na Shopee. ${delivery.text}`,
    price: markedUpPrice,
    originalPrice: price,
    compareAt: null,
    image: product.product_image,
    images: product.image_url_list?.length
      ? product.image_url_list
      : [product.product_image],
    shopName: product.shop_name,
    shopLocation: product.shop_location,
    category: product.category_name,
    sales: product.sales,
    commissionRate: product.commission_rate,
    deliveryDays: delivery.days,
    deliveryText: delivery.text,
    affiliateLink: product.link,
    source: "shopee" as const,
  }
}

export function getAffiliateLink(tags: string): string | null {
  const match = tags.match(/affiliate:(https?:\/\/[^\s,]+)/)
  return match ? match[1] : null
}

export function isShopeeProduct(tags: string): boolean {
  return tags.includes("shopee")
}
