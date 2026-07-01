export const REGION_COOKIE = "lumiere_region"

export interface LocationData {
  city: string
  state: string
  cep: string
}

export const BRAZILIAN_STATES = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
] as const

export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "")
}

export interface CepResponse {
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

export async function fetchAddressByCep(
  cep: string
): Promise<{ city: string; state: string } | null> {
  const clean = normalizeCep(cep)
  if (clean.length !== 8) return null

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data: CepResponse = await res.json()
    return { city: data.city, state: data.state }
  } catch {
    return null
  }
}
