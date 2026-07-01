import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description: "Política de trocas e devoluções. Você tem até 7 dias para solicitar troca ou devolução. Fale com a Jade para assistência.",
  openGraph: { title: "Trocas e Devoluções — Lumière", type: "website" },
}

export default function GenericPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Breadcrumbs items={[{ label: "Trocas e Devoluções" }]} />
        <h1 className="display-md mb-4">Trocas e Devoluções</h1>
        <div className="body-base space-y-4">
          <p>Você tem até <strong>7 dias</strong> após o recebimento para solicitar a troca ou devolução.</p>
          <p>A peça deve estar em perfeito estado, sem indícios de uso, com etiqueta original.</p>
          <p>Entre em contato pelo chat da Jade para iniciar o processo.</p>
        </div>
      </div>
    </div>
  )
}
