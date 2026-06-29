import type { Metadata } from "next"
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ChatWidget } from "@/components/chat/ChatWidget"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Jóia — Moda Feminina Exclusiva",
    template: "%s | Jóia",
  },
  description:
    "Peças exclusivas que vestem sua personalidade. Moda feminina com curadoria especial.",
  metadataBase: new URL("https://joia.com.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Jóia",
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
      className={`${fraunces.variable} ${plusJakarta.variable} ${jetbrains.variable} h-full`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ChatWidget />
        {children}
      </body>
    </html>
  )
}
