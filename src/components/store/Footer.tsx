import Link from "next/link"
import { Camera } from "lucide-react"
import { store } from "@/lib/config"
import { OpenChatButton } from "./OpenChatButton"

const COL_LOJA = [
  { label: "Vestidos", href: "/categoria/vestidos" },
  { label: "Blusas", href: "/categoria/blusas" },
  { label: "Calças", href: "/categoria/calcas" },
  { label: "Acessórios", href: "/categoria/acessorios" },
  { label: "Coleções", href: "/categoria/colecoes" },
]

const COL_INSTITUCIONAL = [
  { label: "Sobre nós", href: "/sobre" },
  { label: "Trocas e devoluções", href: "/trocas" },
  { label: "Política de privacidade", href: "/privacidade" },
  { label: "Frete e entrega", href: "/entrega" },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-cream-200 pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-espresso-800 mb-5 block">
              {store.name}
            </span>
            <p className="text-sm text-espresso-400 leading-relaxed mb-6 max-w-xs break-words">
              {store.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${store.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-cream-200 flex items-center justify-center text-espresso-400 hover:border-rose-300 hover:text-rose-500 transition-all"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <OpenChatButton iconOnly />
            </div>
          </div>

          {/* Loja */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-500 mb-5">
              Loja
            </h4>
            <ul className="space-y-3">
              {COL_LOJA.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-espresso-500 hover:text-rose-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-500 mb-5">
              Institucional
            </h4>
            <ul className="space-y-3">
              {COL_INSTITUCIONAL.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-espresso-500 hover:text-rose-500 transition-colors break-words"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-500 mb-5">
              Atendimento
            </h4>
            <ul className="space-y-3 text-sm text-espresso-500 break-words">
              <li>{store.phone}</li>
              <li>{store.email}</li>
              <li>{store.city}</li>
              <li className="pt-1 text-espresso-400">{store.hours}</li>
            </ul>
          </div>
        </div>

        {/* Base */}
        <div className="mt-12 pt-6 border-t border-cream-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs tracking-wide text-espresso-400">
            &copy; {new Date().getFullYear()} {store.name}. Todos os direitos reservados.
          </p>
          <p className="text-xs tracking-wide text-espresso-400">
            Feito com cuidado por{" "}
            <a
              href={store.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-500 hover:text-rose-400 transition-colors"
            >
              {store.developerName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
