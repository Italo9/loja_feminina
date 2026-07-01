"use client"

import { useState, useEffect } from "react"
import { MapPin, X, Loader2, Navigation } from "lucide-react"
import { REGION_COOKIE, type LocationData, normalizeCep } from "@/lib/location"

const STORAGE_KEY = "lumiere_location"

function getSavedLocation(): LocationData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveLocation(data: LocationData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  document.cookie = `${REGION_COOKIE}=${data.state};path=/;max-age=31536000;samesite=lax`
}

function removeLocation() {
  localStorage.removeItem(STORAGE_KEY)
  document.cookie = `${REGION_COOKIE}=;path=/;max-age=0`
}

async function reverseGeo(lat: number, lng: number): Promise<{ city: string; state: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`,
      { signal: AbortSignal.timeout(5000) },
    )
    if (!res.ok) return null
    const data = await res.json()
    const address = data.address || {}
    const state = address.state || ""
    const city = address.city || address.town || address.municipality || address.county || ""

    const brStates: Record<string, string> = {
      acre: "AC", alagoas: "AL", amapá: "AP", amazonas: "AM", bahia: "BA",
      ceará: "CE", "distrito federal": "DF", "espírito santo": "ES", goiás: "GO",
      maranhão: "MA", "mato grosso": "MT", "mato grosso do sul": "MS",
      "minas gerais": "MG", pará: "PA", paraíba: "PB", paraná: "PR",
      pernambuco: "PE", piauí: "PI", "rio de janeiro": "RJ",
      "rio grande do norte": "RN", "rio grande do sul": "RS", rondônia: "RO",
      roraima: "RR", "santa catarina": "SC", "são paulo": "SP",
      sergipe: "SE", tocantins: "TO",
    }
    const sigla = brStates[state.toLowerCase()] || state.slice(0, 2).toUpperCase()
    return { city: city || state, state: sigla }
  } catch {
    return null
  }
}

async function detectLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const geo = await reverseGeo(pos.coords.latitude, pos.coords.longitude)
        if (geo) {
          resolve({ city: geo.city, state: geo.state, cep: "" })
        } else {
          resolve(null)
        }
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: 600000 },
    )
  })
}

export function LocationBar() {
  const [location, setLocationState] = useState<LocationData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [cep, setCep] = useState("")
  const [fetching, setFetching] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = getSavedLocation()
    if (saved) {
      setLocationState(saved)
      setLoaded(true)
      return
    }
    detectLocation().then((detected) => {
      if (detected) {
        setLocationState(detected)
        saveLocation(detected)
      }
      setLoaded(true)
    })
  }, [])

  const handleGeo = async () => {
    setGeoLoading(true)
    setError("")
    try {
      const detected = await detectLocation()
      if (detected) {
        setLocationState(detected)
        saveLocation(detected)
        setOpen(false)
      } else {
        setError("Não foi possível detectar sua localização")
      }
    } catch {
      setError("Erro ao detectar localização")
    } finally {
      setGeoLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = normalizeCep(cep)
    if (clean.length !== 8) return
    setError("")
    setFetching(true)
    try {
      const res = await fetch(`/api/location?cep=${clean}`)
      if (!res.ok) throw new Error()
      const data: LocationData = await res.json()
      setLocationState(data)
      saveLocation(data)
      setOpen(false)
      setCep("")
    } catch {
      setError("CEP não encontrado")
    } finally {
      setFetching(false)
    }
  }

  const handleRemove = () => {
    setLocationState(null)
    removeLocation()
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[#6B4A4F]/50 hover:text-[#6B4A4F] transition-colors text-[10px] tracking-[0.08em] uppercase"
      >
        <MapPin className="w-3 h-3 text-gold-400/60" />
        {!loaded ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : location ? (
          <span>
            {location.city}, {location.state}
          </span>
        ) : (
          <span>Informe seu CEP</span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#6B4A4F]/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lift p-6 w-full max-w-sm mx-4 animate-slide-up">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#6B4A4F]/30 hover:text-[#6B4A4F]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#6B4A4F] mb-1">
              Calcular frete e prazo
            </h3>
            <p className="text-xs text-plum-500/50 mb-4">
              Informe seu CEP ou use sua localização atual
            </p>

            <button
              type="button"
              onClick={handleGeo}
              disabled={geoLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blush-50 border border-blush-200 text-plum-600 text-sm font-medium hover:bg-blush-100 transition-colors disabled:opacity-50 mb-3"
            >
              {geoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              Usar localização atual
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-pearl-200" />
              <span className="text-[10px] text-plum-300 uppercase tracking-[0.1em]">ou</span>
              <div className="flex-1 h-px bg-pearl-200" />
            </div>

            {location && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-cream-50 rounded-xl">
                <MapPin className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="text-sm font-medium text-[#6B4A4F]">
                    {location.city}, {location.state}
                  </p>
                  <p className="text-[10px] text-[#6B4A4F]/40">CEP {location.cep}</p>
                </div>
                <button
                  onClick={handleRemove}
                  className="ml-auto text-[10px] text-rose-400 hover:text-rose-500 font-medium"
                >
                  Remover
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="00000-000"
                maxLength={8}
                className="flex-1 px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 text-[16px] text-[#6B4A4F] placeholder:text-[#6B4A4F]/30 focus:outline-none focus:border-rose-200 tracking-[0.2em] font-mono"
                autoFocus
              />
              <button
                type="submit"
                disabled={cep.length !== 8 || fetching}
                className="px-5 py-3 rounded-xl bg-rose-400 text-white text-sm font-bold hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "OK"}
              </button>
            </form>
            {error && (
              <p className="text-xs text-red-400 mt-2">{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
