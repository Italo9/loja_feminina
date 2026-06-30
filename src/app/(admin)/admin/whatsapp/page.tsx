"use client"

import { useEffect, useState, useRef } from "react"
import QRCode from "qrcode"

export default function AdminWhatsAppPage() {
  const [status, setStatus] = useState<string>("carregando")
  const [qrSvg, setQrSvg] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)

  const poll = async () => {
    try {
      const r = await fetch("/api/human/qr")
      const d = await r.json()
      setEnabled(d.enabled)
      setStatus(d.connection)
      if (d.qr) {
        const svg = await QRCode.toString(d.qr, {
          type: "svg",
          width: 280,
          margin: 2,
          color: { dark: "#1a1714", light: "#faf6f0" },
        })
        setQrSvg(svg)
      } else if (d.connection === "open") {
        setQrSvg(null)
      }
    } catch {
      setStatus("erro")
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => poll(), 0)
    interval.current = setInterval(poll, 5000)
    return () => {
      clearTimeout(timer)
      if (interval.current) clearInterval(interval.current)
    }
  }, [])

  const statusLabel: Record<string, string> = {
    disconnected: "Desconectado",
    connecting: "Conectando...",
    open: "Conectado",
    close: "Reconectando...",
    carregando: "Carregando...",
    erro: "Erro",
  }

  const statusColor: Record<string, string> = {
    disconnected: "text-espresso-400",
    connecting: "text-gold-600",
    open: "text-green-600",
    close: "text-red-500",
    carregando: "text-espresso-400",
    erro: "text-red-500",
  }

  return (
    <div>
      <h1 className="display-md mb-2">WhatsApp</h1>
      <p className="body-base mb-6">Escaneie o QR code com o WhatsApp do atendente para conectar.</p>

      {!enabled && (
        <div className="surface p-6 text-center">
          <p className="body-base">WhatsApp não está habilitado.</p>
          <p className="text-xs text-espresso-400 mt-1">Defina <code className="bg-cream-100 px-1 rounded">WHATSAPP_ENABLED=true</code> no .env</p>
        </div>
      )}

      {enabled && (
        <div className="surface p-6 text-center max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${status === "open" ? "bg-green-500 animate-pulse" : status === "connecting" ? "bg-gold-500 animate-pulse" : "bg-espresso-300"}`} />
            <span className={`text-sm font-semibold ${statusColor[status] ?? "text-espresso-500"}`}>
              {statusLabel[status] ?? status}
            </span>
          </div>

          {qrSvg ? (
            <div
              className="bg-cream-50 rounded-2xl p-4 inline-block"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          ) : status === "open" ? (
            <div className="py-8">
              <p className="text-green-600 font-semibold text-lg">Conectado!</p>
              <p className="text-sm text-espresso-400 mt-1">WhatsApp pronto para atendimento.</p>
            </div>
          ) : (
            <div className="py-8">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-espresso-400">Aguardando QR code...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
