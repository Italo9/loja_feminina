"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, UserPlus } from "lucide-react"
import { store } from "@/lib/config"

export default function CadastroPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Erro ao criar conta")
      setLoading(false)
      return
    }

    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) {
      setError("Conta criada, mas não foi possível entrar. Tente o login.")
      setLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-espresso-800">
            {store.name}
          </span>
          <p className="body-sm text-espresso-400 mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="surface p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-500 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 text-espresso-700 text-[16px] placeholder:text-espresso-300 focus:outline-none focus:border-rose-300 transition-colors"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-500 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 text-espresso-700 text-[16px] placeholder:text-espresso-300 focus:outline-none focus:border-rose-300 transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-500 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 text-espresso-700 text-[16px] placeholder:text-espresso-300 focus:outline-none focus:border-rose-300 transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-rose w-full text-[15px] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {loading ? "Criando conta..." : "Criar conta"}
          </button>

          <p className="text-center text-sm text-espresso-400 pt-2">
            Já tem conta?{" "}
            <Link href="/login" className="text-rose-500 hover:text-rose-600 font-medium">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
