import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminBottomNav } from "@/components/admin/AdminBottomNav"
import { AdminTopBar } from "@/components/admin/AdminTopBar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") redirect("/login")

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <AdminTopBar />
      <main className="container-narrow py-4">{children}</main>
      <AdminBottomNav />
    </div>
  )
}
