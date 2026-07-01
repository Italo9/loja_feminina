import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { CartProvider } from "@/providers/CartProvider"
import { CartSheet } from "@/components/store/CartSheet"
import { auth } from "@/lib/auth"
import { getFreeShippingThreshold, getFreeShippingMessage } from "@/lib/settings"

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

  const freeShippingThreshold = await getFreeShippingThreshold()
  const freeShippingMsg = await getFreeShippingMessage()

  return (
    <CartProvider>
      <Header user={user} freeShippingThreshold={freeShippingThreshold} freeShippingMsg={freeShippingMsg} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSheet freeShippingThreshold={freeShippingThreshold} freeShippingMsg={freeShippingMsg} />
    </CartProvider>
  )
}
