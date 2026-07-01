import type { Metadata } from "next"
import { Cormorant_Garamond, Jost } from "next/font/google"
import "./globals.css"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { SessionProvider } from "@/providers/SessionProvider"
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/store/JsonLd"
import { CookieConsent } from "@/components/store/CookieConsent"
import { store } from "@/lib/config"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: `${store.name} | ${store.tagline}`,
    template: `%s | ${store.name}`,
  },
  description: store.description,
  metadataBase: new URL(store.url),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: store.name,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jost.variable} h-full`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <SessionProvider>
          <ChatWidget />
          <CookieConsent />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
