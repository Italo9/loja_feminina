"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { store } from "@/lib/config"

export function AdminTopBar() {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-cream-200 shadow-sm">
      <div className="container-narrow flex items-center justify-between h-14">
        <span className="font-[family-name:var(--font-display)] text-xl tracking-wider text-espresso-800">{store.name} Admin</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 text-xs font-medium text-espresso-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  )
}
