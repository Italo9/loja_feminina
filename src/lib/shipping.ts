export const FREE_SHIPPING_THRESHOLD = 250

const REGION_RATES: Record<string, { cost: number; days: number; states: string[] }> = {
  sudeste: { cost: 15, days: 3, states: ["SP", "RJ", "MG", "ES"] },
  sul: { cost: 15, days: 4, states: ["PR", "SC", "RS"] },
  centro_oeste: { cost: 20, days: 5, states: ["MS", "MT", "GO", "DF"] },
  nordeste: { cost: 25, days: 7, states: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"] },
  norte: { cost: 35, days: 10, states: ["AM", "PA", "RR", "AP", "AC", "RO", "TO"] },
}

function getRegionByState(state: string) {
  const upper = state.toUpperCase()
  for (const [region, data] of Object.entries(REGION_RATES)) {
    if (data.states.includes(upper)) return { region, cost: data.cost, days: data.days }
  }
  return null
}

function normalizeCep(cep: string) {
  return cep.replace(/\D/g, "")
}

interface CepResponse {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  location: {
    type: string
    coordinates: { longitude: string; latitude: string }
  }
}

export async function getAddressByCep(
  cep: string
): Promise<{ street: string; neighborhood: string; city: string; state: string } | null> {
  const clean = normalizeCep(cep)
  if (clean.length !== 8) return null

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`)
    if (!res.ok) return null
    const data: CepResponse = await res.json()
    return {
      street: data.street,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    }
  } catch {
    return null
  }
}

export async function calculateShipping(
  cep: string,
  items: { weight?: number; quantity: number }[],
  subtotal: number
): Promise<{ cost: number; days: number; freeThreshold: number }> {
  const hasItems = items.length > 0 && items.some((i) => i.quantity > 0)

  if (!hasItems || subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { cost: 0, days: 0, freeThreshold: FREE_SHIPPING_THRESHOLD }
  }

  const clean = normalizeCep(cep)
  if (clean.length !== 8) {
    return { cost: 0, days: 0, freeThreshold: FREE_SHIPPING_THRESHOLD }
  }

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`)
    if (!res.ok) return { cost: 0, days: 0, freeThreshold: FREE_SHIPPING_THRESHOLD }
    const data: CepResponse = await res.json()

    const region = getRegionByState(data.state)
    if (!region) return { cost: 0, days: 0, freeThreshold: FREE_SHIPPING_THRESHOLD }

    return { cost: region.cost, days: region.days, freeThreshold: FREE_SHIPPING_THRESHOLD }
  } catch {
    return { cost: 0, days: 0, freeThreshold: FREE_SHIPPING_THRESHOLD }
  }
}
