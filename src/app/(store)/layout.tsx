import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { CartProvider } from "@/providers/CartProvider"
import { CartSheet } from "@/components/store/CartSheet"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSheet />
    </CartProvider>
  )
}
