"use client"

import { useState, useEffect } from "react"
import { Shield, X } from "lucide-react"
import Link from "next/link"

const STORAGE_KEY = "lumiere-cookie-consent"

type Consent = "accepted" | "rejected" | null

function getStored(): Consent {
  if (typeof window === "undefined") return null
  const val = localStorage.getItem(STORAGE_KEY)
  if (val === "accepted" || val === "rejected") return val
  return null
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setConsent(getStored())
    setMounted(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setConsent("accepted")
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected")
    setConsent("rejected")
  }

  if (!mounted || consent !== null) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] animate-slide-up">
      <div className="surface max-w-lg mx-auto p-5 shadow-lg border border-rose-200/50 rounded-2xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-plum-600 mb-1">
              <span className="font-semibold">Sua privacidade importa.</span>
            </p>
            <p className="text-[13px] text-plum-500/80 leading-relaxed mb-3">
              Usamos cookies essenciais para o funcionamento da loja e,
              com sua permissão, para melhorar sua experiência.
              Veja nossa{" "}
              <Link href="/privacidade" className="underline hover:text-rose-500 transition-colors">
                Política de Privacidade
              </Link>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={accept}
                className="btn-rose text-xs py-2.5 px-5 flex-1"
              >
                Aceitar todos
              </button>
              <button
                onClick={reject}
                className="text-xs py-2.5 px-5 rounded-full border border-rose-200 text-plum-500 hover:bg-rose-50 transition-colors flex-1"
              >
                Apenas essenciais
              </button>
            </div>
          </div>
          <button
            onClick={reject}
            className="p-1 text-plum-300 hover:text-plum-500 transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
