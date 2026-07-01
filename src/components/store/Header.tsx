"use client"

import { useState, useEffect } from "react"
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react"
import Link from "next/link"
import { store } from "@/lib/config"
import { useCartStore } from "@/lib/cart-store"
import { LocationBar } from "./LocationBar"

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
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))

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
            ? "bg-[#FFF6F2]/90 backdrop-blur-xl shadow-soft"
            : "bg-transparent"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-center gap-3 bg-[#FFF6F2] text-[#6B4A4F]/50 text-[10px] tracking-[0.22em] uppercase py-2 border-b border-gold-400/15">
          <span className="text-gold-400/50">✦</span>
          Frete grátis acima de R$ 250
          <span className="text-gold-400/50">✦</span>
          <span className="text-gold-400/20">|</span>
          <LocationBar />
        </div>

        <div className="container-narrow flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2 text-[#6B4A4F]/60"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col items-center flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-medium tracking-[0.04em] text-[#6B4A4F]">
              {store.name}
              <span className="text-gold-400 ml-1 text-base align-middle">✦</span>
            </span>
            <span className="hidden md:block text-[10px] tracking-[0.1em] text-[#6B4A4F]/40 font-light mt-0.5">
              Luz que vem de você <span className="text-rose-300">♡</span>
            </span>
          </Link>

          {/* Left nav */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[11px] uppercase tracking-[0.16em] font-medium text-[#6B4A4F]/60 hover:text-[#6B4A4F] transition-colors group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-rose-200 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right nav */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
            {NAV_LINKS.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[11px] uppercase tracking-[0.16em] font-medium text-[#6B4A4F]/60 hover:text-[#6B4A4F] transition-colors group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-rose-200 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-0.5 md:gap-1 md:ml-7">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#6B4A4F]/50 hover:text-[#6B4A4F] transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-[17px] h-[17px]" />
            </button>
            <Link
              href="/favoritos"
              className="p-2 text-[#6B4A4F]/50 hover:text-[#6B4A4F] transition-colors hidden md:flex"
              aria-label="Favoritos"
            >
              <Heart className="w-[17px] h-[17px]" />
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event("cart:open"))}
              className="p-2 text-[#6B4A4F]/50 hover:text-[#6B4A4F] transition-colors relative"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-[17px] h-[17px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#DCA7A7] text-white text-[9px] font-semibold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gold-400/10 bg-[#FFF6F2] animate-slide-up">
            <div className="container-narrow py-3">
              <form action="/busca" className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4A4F]/25" />
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar peças..."
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-cream-200 text-[16px] text-[#6B4A4F] placeholder:text-[#6B4A4F]/30 focus:outline-none focus:border-rose-200 transition-all"
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
            className="absolute inset-0 bg-[#6B4A4F]/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#FFF6F2] shadow-lift flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-cream-200">
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-[0.04em] text-[#6B4A4F]">
                  {store.name}
                  <span className="text-gold-400 ml-1">✦</span>
                </span>
                <span className="text-[10px] tracking-[0.08em] text-[#6B4A4F]/40 font-light mt-0.5">
                  Luz que vem de você ♡
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#6B4A4F]/50"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center py-4 text-[14px] uppercase tracking-[0.12em] font-medium text-[#6B4A4F]/70 border-b border-cream-100 last:border-0 hover:text-[#6B4A4F] hover:bg-rose-50/50 rounded-lg px-3 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-5 border-t border-cream-200 bg-white/20">
              <Link
                href="/conta"
                className="flex items-center gap-3 py-3 text-[12px] uppercase tracking-[0.12em] text-[#6B4A4F]/50 hover:text-[#6B4A4F] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Minha Conta
              </Link>
              <Link
                href="/favoritos"
                className="flex items-center gap-3 py-3 text-[12px] uppercase tracking-[0.12em] text-[#6B4A4F]/50 hover:text-[#6B4A4F] transition-colors"
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
