import Link from "next/link"
import { ChevronLeft, UserRound } from "lucide-react"
import { auth, signOut } from "@/lib/auth"

export default async function ContaPage() {
  const session = await auth()

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>

        <h1 className="display-lg mb-8">Minha Conta</h1>

        {session?.user ? (
          <div className="surface max-w-md space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <UserRound className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-espresso-700">
                  {session.user.name ?? session.user.email}
                </p>
                <p className="text-sm text-espresso-400">{session.user.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200">
              <Link
                href="/conta/pedidos"
                className="block py-3 text-espresso-600 hover:text-rose-500 transition-colors"
              >
                Meus Pedidos
              </Link>
              <Link
                href="/conta/enderecos"
                className="block py-3 text-espresso-600 hover:text-rose-500 transition-colors"
              >
                Meus Endereços
              </Link>
              <Link
                href="/carrinho"
                className="block py-3 text-espresso-600 hover:text-rose-500 transition-colors"
              >
                Carrinho
              </Link>
              <Link
                href="/favoritos"
                className="block py-3 text-espresso-600 hover:text-rose-500 transition-colors"
              >
                Favoritos
              </Link>
            </div>

            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
              className="pt-4 border-t border-cream-200"
            >
              <button type="submit" className="text-sm text-espresso-400 hover:text-red-500 transition-colors">
                Sair da conta
              </button>
            </form>
          </div>
        ) : (
          <div className="surface max-w-md text-center p-8">
            <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4">
              <UserRound className="w-6 h-6 text-espresso-300" />
            </div>
            <p className="body-base mb-4">Faça login para acessar sua conta.</p>
            <Link href={`/login?callbackUrl=/conta`} className="btn-rose">
              Entrar
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
