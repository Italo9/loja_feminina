import { cache } from "react"
import { prisma } from "./db"

const defaults: Record<string, string> = {
  free_shipping_threshold: "250",
  free_shipping_message: "Frete grátis acima de",
  shipping_info: "Enviamos para todo Brasil",
  whatsapp_number: "5571997006042",
}

export const getSetting = cache(async (key: string): Promise<string> => {
  try {
    const s = await prisma.setting.findUnique({ where: { key } })
    return s?.value || defaults[key] || ""
  } catch {
    return defaults[key] || ""
  }
})

export const getFreeShippingThreshold = cache(async (): Promise<number> => {
  const val = await getSetting("free_shipping_threshold")
  return parseFloat(val) || 250
})

export const getFreeShippingMessage = cache(async (): Promise<string> => {
  return getSetting("free_shipping_message")
})

export const getShippingInfo = cache(async (): Promise<string> => {
  return getSetting("shipping_info")
})
