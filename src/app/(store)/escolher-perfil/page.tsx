import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, UserRound } from "lucide-react"
import { auth } from "@/lib/auth"

export default async function EscolherPerfilPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const name = session.user.name?.split(" ")[0] ?? "bem-vinda"
  const role = (session.user as { role?: string }).role

  if (role !== "ADMIN") redirect("/")

  return (
    <div className="min-h-screen bg-pearl-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <span className="font-[family-name:var(--font-display)] text-4xl tracking-[0.04em] text-plum-800 block mb-4">
          Olá, {name}!
        </span>
        <p className="body-base text-plum-500/70 mb-10">
          Como deseja continuar?
        </p>

        <div className="space-y-4">
          <Link
            href="/admin"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-blush-500 text-white font-bold text-[15px] shadow-soft hover:shadow-md transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            Painel Administrativo
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white border border-pearl-200 text-plum-600 font-medium text-[15px] hover:bg-pearl-50 transition-colors"
          >
            <UserRound className="w-5 h-5" />
            Continuar como cliente
          </Link>
        </div>
      </div>
    </div>
  )
}
