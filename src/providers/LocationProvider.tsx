"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { REGION_COOKIE, type LocationData, normalizeCep } from "@/lib/location"

interface LocationContextType {
  location: LocationData | null
  loading: boolean
  setLocation: (cep: string) => Promise<void>
  clearLocation: () => void
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  loading: true,
  setLocation: async () => {},
  clearLocation: () => {},
})

const STORAGE_KEY = "lumiere_location"

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)

  const persist = useCallback((data: LocationData | null) => {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      document.cookie = `${REGION_COOKIE}=${data.state};path=/;max-age=31536000;samesite=lax`
    } else {
      localStorage.removeItem(STORAGE_KEY)
      document.cookie = `${REGION_COOKIE}=;path=/;max-age=0`
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed: LocationData = JSON.parse(saved)
        setLocationState(parsed)
        document.cookie = `${REGION_COOKIE}=${parsed.state};path=/;max-age=31536000;samesite=lax`
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const setLocation = useCallback(async (cep: string) => {
    const clean = normalizeCep(cep)
    if (clean.length !== 8) return

    try {
      const res = await fetch(`/api/location?cep=${clean}`)
      if (!res.ok) return
      const data: LocationData = await res.json()
      setLocationState(data)
      persist(data)
    } catch {
      // silently fail
    }
  }, [persist])

  const clearLocation = useCallback(() => {
    setLocationState(null)
    persist(null)
  }, [persist])

  return (
    <LocationContext.Provider value={{ location, loading, setLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  return useContext(LocationContext)
}
