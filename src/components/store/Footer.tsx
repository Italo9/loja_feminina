import Link from "next/link"
import { Camera } from "lucide-react"
import { store } from "@/lib/config"
import { OpenChatButton } from "./OpenChatButton"
import { ContactLink } from "./ContactLink"

const COL_LOJA = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Novidades", href: "/categoria/novidades" },
  { label: "Mais Vendidos", href: "/categoria/mais-vendidos" },
]

const COL_AJUDA = [
  { label: "Entrega", href: "/entrega" },
  { label: "Trocas e Devoluções", href: "/trocas" },
  { label: "Guia de Medidas", href: "/guia-de-medidas" },
  { label: "FAQ", href: "/faq" },
]

const COL_INSTITUCIONAL = [
  { label: "Sobre", href: "/sobre" },
  { label: "Privacidade", href: "/privacidade" },
]

export function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 md:pt-20 md:pb-10 border-t">
      <hr className="hairline-gold" />
      <div className="container-narrow pt-16 md:pt-20">
        {/* Brand statement */}
        <div className="text-center mb-14">
          <span className="font-[family-name:var(--font-display)] text-4xl md:text-5xl tracking-[0.08em] text-[#6B4A4F] block mb-3">
            LUMIÉRE
          </span>
          <p className="body-sm text-[#B58FA2] italic">
            Luz que vem de você ♡
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 mb-14">
          {/* Loja */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A66B] mb-5">
              Loja
            </h4>
            <ul className="space-y-3">
              {COL_LOJA.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#6B4A4F]/70 hover:text-[#DCA7A7] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A66B] mb-5">
              Ajuda
            </h4>
            <ul className="space-y-3">
              {COL_AJUDA.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#6B4A4F]/70 hover:text-[#DCA7A7] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <ContactLink />
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A66B] mb-5">
              Institucional
            </h4>
            <ul className="space-y-3">
              {COL_INSTITUCIONAL.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#6B4A4F]/70 hover:text-[#DCA7A7] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Atendimento */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A66B] mb-5">
              Conecte-se
            </h4>
            <div className="flex items-center gap-3 mb-5">
              <a
                href={`https://instagram.com/${store.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#C9A66B]/30 flex items-center justify-center text-[#C9A66B] hover:bg-[#F6D8D6]/30 hover:border-[#DCA7A7] transition-all"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <OpenChatButton iconOnly />
            </div>
            <ul className="space-y-2.5 text-sm text-[#6B4A4F]/60">
              <li>{store.email}</li>
              <li>{store.city}</li>
              <li className="text-[#6B4A4F]/40">{store.hours}</li>
            </ul>

            <div className="mt-5 pt-5 border-t border-cream-100">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A66B] mb-3">
                Pagamento
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {store.payments.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg bg-cream-50 border border-cream-200 text-[10px] font-medium text-espresso-500"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <hr className="hairline-gold w-full md:hidden" />
          <p className="text-xs tracking-wide text-[#6B4A4F]/50">
            &copy; {new Date().getFullYear()} {store.name}. Todos os direitos reservados.
          </p>
          <p className="text-xs tracking-wide text-[#6B4A4F]/50">
            Feito com cuidado por{" "}
            <a
              href={store.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A66B] hover:text-[#DCA7A7] transition-colors"
            >
              {store.developerName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
