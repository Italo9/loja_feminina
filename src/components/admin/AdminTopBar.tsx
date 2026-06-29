"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function AdminTopBar() {
  return (
    <div className="sticky top-0 z-40 bg-pearl-100 border-b border-pearl-200">
      <div className="container-narrow flex items-center justify-between h-14">
        <span className="display-sm text-berry-700">Jóia Admin</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 text-xs font-medium text-espresso-500 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  )
}
