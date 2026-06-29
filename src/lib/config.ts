// Configuração white-label da loja.
// Tudo é sobrescrito por variável de ambiente — mesmo código, múltiplas lojas.

function readEnv(key: string, fallback: string): string {
  const value = process.env[key]
  if (value && value.trim() !== "") return value.trim()
  return fallback
}

function readList(key: string, fallback: string): string[] {
  return readEnv(key, fallback)
    .split(",")
    .map((i) => i.trim())
    .filter((i) => i !== "")
}

export const store = {
  name: readEnv("NEXT_PUBLIC_STORE_NAME", "Jóia"),
  shortName: readEnv("NEXT_PUBLIC_STORE_SHORT_NAME", "Jóia"),
  tagline: readEnv("NEXT_PUBLIC_STORE_TAGLINE", "Moda Feminina"),
  description: readEnv(
    "NEXT_PUBLIC_STORE_DESCRIPTION",
    "Peças exclusivas que vestem sua personalidade. Moda feminina com curadoria.",
  ),
  city: readEnv("NEXT_PUBLIC_STORE_CITY", "Salvador, BA"),
  whatsapp: readEnv("NEXT_PUBLIC_STORE_WHATSAPP", "5571991673902"),
  phone: readEnv("NEXT_PUBLIC_STORE_PHONE", "(71) 99167-3902"),
  email: readEnv("NEXT_PUBLIC_STORE_EMAIL", "contato@joia.com.br"),
  instagram: readEnv("NEXT_PUBLIC_STORE_INSTAGRAM", "joia"),
  payments: readList("NEXT_PUBLIC_STORE_PAYMENTS", "Visa,Mastercard,Elo,Pix,Boleto"),
  shippingInfo: readEnv(
    "NEXT_PUBLIC_STORE_SHIPPING",
    "Enviamos para todo Brasil",
  ),
  hours: readEnv(
    "NEXT_PUBLIC_STORE_HOURS",
    "Seg a Sex, 9h às 18h",
  ),
  developerName: readEnv("NEXT_PUBLIC_DEVELOPER_NAME", "Ítalo Lima"),
  developerUrl: readEnv("NEXT_PUBLIC_DEVELOPER_URL", "https://italolima.com.br"),
}

export const assistant = {
  name: readEnv("NEXT_PUBLIC_ASSISTANT_NAME", "Jade"),
  role: readEnv("NEXT_PUBLIC_ASSISTANT_ROLE", "sua stylist virtual"),
  availability: readEnv("NEXT_PUBLIC_ASSISTANT_AVAILABILITY", "Atendimento 24 horas"),
}

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${store.whatsapp}`
  if (text) return `${base}?text=${encodeURIComponent(text)}`
  return base
}
