"use client"

import { useState, type FormEvent } from "react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setMessage(data.error ?? "Erro ao cadastrar.")
        return
      }

      setStatus("success")
      setMessage(data.message ?? "Cadastro realizado com sucesso!")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Erro de conexão. Tente novamente.")
    }
  }

  return (
    <div>
      <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== "idle") {
              setStatus("idle")
              setMessage("")
            }
          }}
          placeholder="Seu melhor e-mail"
          required
          className="flex-1 px-5 py-3.5 rounded-full bg-white border border-cream-200 text-espresso-700 placeholder:text-espresso-300 text-[16px] focus:outline-none focus:border-rose-300 shadow-sm transition-colors"
        />
        <button type="submit" disabled={status === "loading"} className="btn-rose disabled:opacity-60">
          {status === "loading" ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      {message && (
        <p
          className={`text-sm text-center mt-3 ${
            status === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
