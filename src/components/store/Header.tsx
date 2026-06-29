"use client"

import { useState, useEffect } from "react"
import { Search, Heart, ShoppingBag, Menu, X, Sparkles } from "lucide-react"
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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-pearl-100/90 backdrop-blur-lg shadow-soft"
            : "bg-pearl-100"
        }`}
      >
        {/* Top bar - subtle */}
        <div className="hidden md:flex items-center justify-center gap-2 bg-berry-600 text-white text-[11px] tracking-widest uppercase py-2 font-medium">
          <Sparkles className="w-3 h-3" />
          Frete grátis nas compras acima de R$ 250
          <Sparkles className="w-3 h-3" />
        </div>

        <div className="container-narrow flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex flex-col gap-1.5 p-2 -ml-2"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 text-espresso-900" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="display-md text-berry-700 tracking-tight">
              Jóia
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[13px] font-medium text-espresso-700 hover:text-berry-600 transition-colors rounded-lg hover:bg-berry-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-espresso-700 hover:text-berry-600 transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites */}
            <Link
              href="/favoritos"
              className="p-2 text-espresso-700 hover:text-berry-600 transition-colors relative hidden md:flex"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => window.dispatchEvent(new Event("cart:open"))}
              className="p-2 text-espresso-700 hover:text-berry-600 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0 -right-0 w-4 h-4 rounded-full bg-berry-600 text-white text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Search bar expandida */}
        {searchOpen && (
          <div className="border-t border-pearl-200 bg-pearl-50 animate-slide-up">
            <div className="container-narrow py-3">
              <form action="/busca" className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar produtos..."
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:ring-2 focus:ring-berry-200 focus:border-berry-300 transition-all"
                />
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-espresso-950/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-pearl-100 animate-slide-in-right shadow-lift flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-pearl-200">
              <span className="display-sm text-berry-700">Jóia</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5 text-espresso-700" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center py-3.5 text-[17px] font-medium text-espresso-800 border-b border-pearl-200 last:border-0 hover:text-berry-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-pearl-200">
              <Link
                href="/conta"
                className="flex items-center gap-3 py-3 text-[15px] font-medium text-espresso-600"
                onClick={() => setMobileOpen(false)}
              >
                Minha Conta
              </Link>
              <Link
                href="/favoritos"
                className="flex items-center gap-3 py-3 text-[15px] font-medium text-espresso-600"
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
