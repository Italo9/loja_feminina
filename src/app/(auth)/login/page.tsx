"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, LogIn } from "lucide-react"
import { store } from "@/lib/config"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) {
      setError("Email ou senha inválidos")
      setLoading(false)
      return
    }
    const session = await fetch("/api/auth/session").then(r => r.json())
    const role = (session?.user as { role?: string })?.role
    router.push(role === "ADMIN" ? "/admin" : "/")
    router.refresh()
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-[family-name:var(--font-display)] text-4xl tracking-wider text-espresso-800">{store.name}</span>
            <p className="body-sm text-espresso-400 mt-2">Acesse sua conta</p>
        </div>

        <div className="surface p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">{error}</div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-cream-200 bg-white text-espresso-700 text-[15px] font-medium hover:bg-cream-50 transition-colors disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {googleLoading ? "Entrando..." : "Entrar com Google"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-cream-200" />
            <span className="text-xs text-espresso-300 uppercase">ou</span>
            <div className="flex-1 h-px bg-cream-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-500 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 text-espresso-700 text-[16px] placeholder:text-espresso-300 focus:outline-none focus:border-rose-300 transition-colors" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-500 mb-2">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 text-espresso-700 text-[16px] placeholder:text-espresso-300 focus:outline-none focus:border-rose-300 transition-colors" placeholder="Senha" />
            </div>
            <button type="submit" disabled={loading} className="btn-rose w-full text-[15px] disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-espresso-400 pt-2">
            Não tem conta?{" "}
            <a href="/cadastro" className="text-rose-500 hover:text-rose-600 font-medium">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
