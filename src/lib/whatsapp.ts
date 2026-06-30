// Gerenciador WhatsApp (Baileys) — roda in-process no Next.js (Cloud Run).
// Mantém a conexão WebSocket viva e gerencia sessões de atendimento humano.
// Iniciado via instrumentation.ts no boot do servidor.

let sock: any = null
let latestQR: string | null = null
let connectionState: "disconnected" | "connecting" | "open" | "close" = "disconnected"

const WHATSAPP_ENABLED =
  (process.env.WHATSAPP_ENABLED || "false").toLowerCase() === "true"
const ATTENDANT_NUMBER = (
  process.env.WHATSAPP_ATTENDANT_NUMBER || ""
).replace(/\D/g, "")
const AUTH_DIR =
  (process.env.WHATSAPP_AUTH_DIR || "./.whatsapp-auth") + "/state"
const HUMAN_TIMEOUT_MS = Number(process.env.HUMAN_TIMEOUT_MS || 180000)

// --------------- Session store ---------------
interface Session {
  id: string
  name: string
  active: boolean
  lastClientActivity: number
  queue: { id: string; text: string; at: number }[]
  ended: { reason: string } | null
}

const sessions = new Map<string, Session>()
let activeSessionId: string | null = null
let counter = 0

function nextId(): string {
  counter += 1
  return `${Date.now()}-${counter}`
}

function startSession(id: string, name: string): Session {
  const session: Session = {
    id,
    name,
    active: true,
    lastClientActivity: Date.now(),
    queue: [],
    ended: null,
  }
  sessions.set(id, session)
  activeSessionId = id
  return session
}

function enqueueToAllActive(text: string): number {
  let count = 0
  for (const s of sessions.values()) {
    if (s.active) {
      s.queue.push({ id: nextId(), text, at: Date.now() })
      count += 1
    }
  }
  return count
}

function endSession(id: string, reason: string) {
  const s = sessions.get(id)
  if (!s) return
  s.active = false
  s.ended = { reason }
  if (activeSessionId === id) activeSessionId = null
}

const lastPolled = new Map<string, number>()

function drainSession(id: string) {
  const s = sessions.get(id)
  if (!s) {
    return { active: false, messages: [] as any[], ended: null }
  }
  const since = lastPolled.get(id) || 0
  const now = Date.now()
  const messages = s.queue.filter((m) => m.at > since)
  lastPolled.set(id, now)
  s.queue = s.queue.filter((m) => m.at <= since)
  const ended = s.ended
  if (ended) {
    sessions.delete(id)
    lastPolled.delete(id)
  }
  return { active: s.active, messages, ended }
}

function sweepTimeouts() {
  const now = Date.now()
  for (const s of sessions.values()) {
    if (s.active && now - s.lastClientActivity >= HUMAN_TIMEOUT_MS) {
      endSession(s.id, "timeout")
    }
  }
}

function jidMatches(jid: string, number: string): boolean {
  const clean = (s: string) => s.replace(/\D/g, "")
  const a = clean(jid)
  const b = clean(number)
  if (a === b) return true
  if (b.length >= 12 && a.length >= 11) {
    const shorter = a.length < b.length ? a : b
    const longer = a.length < b.length ? b : a
    if (
      longer.length === shorter.length + 1 &&
      longer.startsWith(shorter.slice(0, 4))
    ) {
      return longer.slice(0, 4) + longer.slice(5) === shorter
    }
  }
  return false
}

function extractText(message: any): string {
  const conversation = message?.conversation
  if (typeof conversation === "string") return conversation
  const extended = message?.extendedTextMessage
  if (extended && typeof extended.text === "string") return extended.text
  return ""
}

// --------------- WhatsApp connection ---------------
let _reconnectAttempt = 0

export async function connectWhatsApp() {
  if (!WHATSAPP_ENABLED) {
    console.log("[WHATSAPP] WHATSAPP_ENABLED=false, WhatsApp offline")
    return
  }
  if (connectionState === "connecting" || connectionState === "open") return

  connectionState = "connecting"
  try {
    await require("fs").promises.mkdir(AUTH_DIR, { recursive: true })
  } catch (_) {}

  const { makeWASocket, useMultiFileAuthState } = await import(
    "@whiskeysockets/baileys"
  )

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)

  sock = makeWASocket({
    auth: state,
    logger: require("pino")({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["Lumiere Boutique", "Chrome", "1.0.0"],
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (raw: any) => {
    const { qr, connection, lastDisconnect } = raw
    if (qr) {
      latestQR = qr
      console.log("[WHATSAPP] QR code gerado — acesse /admin/whatsapp para escanear")
    }
    if (connection === "open") {
      connectionState = "open"
      latestQR = null
      _reconnectAttempt = 0
      console.log("[WHATSAPP] Conectado!")
    }
    if (connection === "close") {
      connectionState = "close"
      const err = lastDisconnect?.error
      const statusCode = err?.output?.statusCode
      console.log(
        "[WHATSAPP] Desconectado, status:",
        statusCode,
        err?.message || "",
      )
      if (statusCode === 401) {
        try {
          const fs = require("fs")
          const path = require("path")
          if (fs.existsSync(AUTH_DIR)) {
            for (const f of fs.readdirSync(AUTH_DIR)) {
              try {
                fs.unlinkSync(path.join(AUTH_DIR, f))
              } catch (_) {}
            }
          }
          console.log("[WHATSAPP] auth limpo, novo QR será gerado")
        } catch (_) {}
      }
      sock = null
      _reconnectAttempt++
      const delay = Math.min(5000 * Math.pow(2, _reconnectAttempt - 1), 120000)
      console.log(
        `[WHATSAPP] reconectando em ${delay / 1000}s (tentativa ${_reconnectAttempt})`,
      )
      setTimeout(connectWhatsApp, delay)
    }
  })

  sock.ev.on("messages.upsert", (raw: any) => {
    const list = raw.messages ?? []
    for (const m of list) {
      const key = m.key
      const message = m.message
      if (!message || !key) continue
      const from = (key.remoteJid ?? "").toString()
      const isMe = !!key.fromMe
      if (!isMe && !jidMatches(from, ATTENDANT_NUMBER)) continue
      const text = extractText(message)
      if (!text.trim()) continue
      if (
        isMe &&
        (text.startsWith("Cliente:") || text.startsWith("*NOVO"))
      )
        continue
      enqueueToAllActive(text.trim())
    }
  })
}

async function sendToAttendant(text: string) {
  if (!sock || connectionState !== "open") {
    throw new Error("WhatsApp offline")
  }
  const jid = `${ATTENDANT_NUMBER}@s.whatsapp.net`
  await sock.sendMessage(jid, { text })
}

// --------------- Public API (chamada pelas API routes) ---------------

export function getQR() {
  return {
    enabled: WHATSAPP_ENABLED,
    connection: connectionState,
    qr: latestQR,
  }
}

export function getStatus() {
  return { enabled: WHATSAPP_ENABLED, connection: connectionState }
}

export async function handleStart(sessionId: string, name: string) {
  startSession(sessionId, name.trim())
  console.log("[WHATSAPP] nova sessao:", sessionId, "nome:", name.trim())

  if (!WHATSAPP_ENABLED || connectionState !== "open") {
    return { ok: false, enabled: false }
  }

  try {
    await sendToAttendant(
      `*NOVO ATENDIMENTO*\n\nCliente: ${name.trim()}\n\nResponda por aqui. Suas mensagens aparecem para o cliente dentro do site.`,
    )
    return { ok: true, enabled: true }
  } catch (error: any) {
    console.error("[WHATSAPP/start] erro:", error.message)
    return { ok: false, enabled: true, error: "whatsapp indisponivel" }
  }
}

export async function handleMessage(
  sessionId: string,
  text: string,
): Promise<{ ok: boolean; active?: boolean; enabled?: boolean; error?: string }> {
  const session = sessions.get(sessionId)
  if (!session || !session.active) {
    return { ok: false, active: false }
  }
  session.lastClientActivity = Date.now()
  activeSessionId = sessionId

  if (!WHATSAPP_ENABLED || connectionState !== "open") {
    return { ok: false, enabled: false }
  }
  try {
    await sendToAttendant(`Cliente: ${session.name}\n\n${text.trim()}`)
    return { ok: true }
  } catch (error: any) {
    console.error("[WHATSAPP/message] erro:", error.message)
    return { ok: false, error: "whatsapp indisponivel" }
  }
}

export function handlePoll(sessionId: string) {
  if (!sessionId) {
    return { active: false, messages: [], ended: null }
  }
  sweepTimeouts()
  return drainSession(sessionId)
}

export async function handleEnd(sessionId: string) {
  const session = sessions.get(sessionId)
  if (
    session &&
    session.active &&
    WHATSAPP_ENABLED &&
    connectionState === "open"
  ) {
    try {
      await sendToAttendant(
        `Cliente ${session.name} encerrou o atendimento.`,
      )
    } catch (_) {}
  }
  endSession(sessionId, "manual")
  return { ok: true }
}

let sweepIntervalId: ReturnType<typeof setInterval> | null = null

// Limpeza periódica
if (typeof setInterval !== "undefined") {
  sweepIntervalId = setInterval(sweepTimeouts, 30000)
}

export function stopSweepInterval() {
  if (sweepIntervalId !== null) {
    clearInterval(sweepIntervalId)
    sweepIntervalId = null
  }
}
