"use client"

import { useState, useEffect } from "react"
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react"
import Link from "next/link"
import { store } from "@/lib/config"

const NAV_LINKS = [
  { label: "Vestidos", href: "/categoria/vestidos" },
  { label: "Blusas", href: "/categoria/blusas" },
  { label: "Calças", href: "/categoria/calcas" },
  { label: "Moda Praia", href: "/categoria/moda-praia" },
  { label: "Acessórios", href: "/categoria/acessorios" },
  { label: "Coleções", href: "/categoria/colecoes" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
  }, [mobileOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-cream-200 shadow-soft"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Top bar - anúncio */}
        <div className="hidden md:flex items-center justify-center gap-3 bg-rose-50 text-rose-600 text-[10px] tracking-[0.25em] uppercase py-2.5 font-semibold">
          <span className="w-1 h-1 rounded-full bg-rose-400" />
          Frete grátis em compras acima de R$ 250
          <span className="w-1 h-1 rounded-full bg-rose-400" />
        </div>

        <div className="container-narrow flex items-center justify-between h-16 md:h-22">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2 text-espresso-600"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link
            href="/"
            className="flex items-center flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            <span className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-[0.06em] text-espresso-800">
              {store.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 flex-1">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.18em] font-medium text-espresso-500 hover:text-rose-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-7 flex-1 justify-end">
            {NAV_LINKS.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.18em] font-medium text-espresso-500 hover:text-rose-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 md:gap-2 md:ml-7">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-espresso-500 hover:text-rose-500 transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link
              href="/favoritos"
              className="p-2 text-espresso-500 hover:text-rose-500 transition-colors hidden md:flex"
              aria-label="Favoritos"
            >
              <Heart className="w-[18px] h-[18px]" />
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event("cart:open"))}
              className="p-2 text-espresso-500 hover:text-rose-500 transition-colors relative"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-cream-200 bg-white animate-slide-up">
            <div className="container-narrow py-3">
              <form action="/busca" className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-300" />
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar peças..."
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-cream-50 border border-cream-200 text-[16px] text-espresso-700 placeholder:text-espresso-300 focus:outline-none focus:border-rose-300 transition-all"
                />
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-espresso-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-lift flex flex-col border-r border-cream-200 animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-cream-200">
              <span className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-wider text-espresso-800">
                {store.name}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-espresso-500"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center py-4 text-[15px] uppercase tracking-[0.12em] font-medium text-espresso-700 border-b border-cream-100 last:border-0 hover:text-rose-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-5 border-t border-cream-200 bg-cream-50">
              <Link
                href="/conta"
                className="flex items-center gap-3 py-3 text-[13px] uppercase tracking-[0.12em] text-espresso-500"
                onClick={() => setMobileOpen(false)}
              >
                Minha Conta
              </Link>
              <Link
                href="/favoritos"
                className="flex items-center gap-3 py-3 text-[13px] uppercase tracking-[0.12em] text-espresso-500"
                onClick={() => setMobileOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
