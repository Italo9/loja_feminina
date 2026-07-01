import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { CartProvider } from "@/providers/CartProvider"
import { CartSheet } from "@/components/store/CartSheet"
import { auth } from "@/lib/auth"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user
    ? {
        name: session.user.name ?? null,
        role: (session.user as { role?: string }).role ?? "CUSTOMER",
      }
    : null

  return (
    <CartProvider>
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSheet />
    </CartProvider>
  )
}
