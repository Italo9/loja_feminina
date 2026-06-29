import Link from "next/link"
import { Camera, MessageCircle } from "lucide-react"
import { store, whatsappUrl } from "@/lib/config"

export function Footer() {
  return (
    <footer className="bg-espresso-950 text-pearl-200">
      <div className="container-narrow py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="display-md text-white mb-4 block">Jóia</span>
            <p className="text-sm text-espresso-300 leading-relaxed mb-6">
              {store.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${store.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-espresso-800 flex items-center justify-center text-espresso-300 hover:bg-berry-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-espresso-800 flex items-center justify-center text-espresso-300 hover:bg-berry-600 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-espresso-400 mb-5">
              Loja
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Vestidos", href: "/categoria/vestidos" },
                { label: "Blusas", href: "/categoria/blusas" },
                { label: "Calças", href: "/categoria/calcas" },
                { label: "Moda Praia", href: "/categoria/moda-praia" },
                { label: "Acessórios", href: "/categoria/acessorios" },
                { label: "Todos", href: "/catalogo" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-espresso-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-espresso-400 mb-5">
              Ajuda
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Minha Conta", href: "/conta" },
                { label: "Meus Pedidos", href: "/conta/pedidos" },
                { label: "Trocas & Devoluções", href: "/trocas" },
                { label: "Como Comprar", href: "/como-comprar" },
                { label: "Fale Conosco", href: "/contato" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-espresso-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-espresso-400 mb-5">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-espresso-300">
              <li>{store.phone}</li>
              <li>{store.email}</li>
              <li>{store.city}</li>
              <li className="pt-2">{store.hours}</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-espresso-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-espresso-400">
            &copy; {new Date().getFullYear()} Jóia. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-espresso-400">
            Feito com amor por{" "}
            <a
              href={store.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-espresso-300 hover:text-white transition-colors"
            >
              {store.developerName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
