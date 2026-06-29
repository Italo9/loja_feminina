"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) {
      setError("Email ou senha inválidos")
      setLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-pearl-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="display-lg text-berry-700">Jóia</span>
          <p className="body-sm text-espresso-400 mt-2">Acesse o painel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-pearl-200 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="admin@joia.com.br" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="Senha" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-full bg-berry-600 text-white font-bold text-[15px] hover:bg-berry-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
