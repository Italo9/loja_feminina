import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <p className="font-[family-name:var(--font-display)] text-8xl text-rose-200 mb-4">404</p>
        <h1 className="display-md mb-3">Página não encontrada</h1>
        <p className="body-base mb-8">
          A página que você procura não existe ou foi movida.
        </p>
        <Link href="/" className="btn-rose">
          <ChevronLeft className="w-4 h-4" />
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}
