import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Entrega",
  description: "Política de entrega e frete. Enviamos para todo Brasil com frete grátis acima de R$ 250. Prazo de processamento de 1 a 2 dias úteis.",
  openGraph: { title: "Política de Entrega | Lumière", type: "website" },
}

export default function GenericPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Breadcrumbs items={[{ label: "Entrega" }]} />
        <h1 className="display-md mb-4">Entrega</h1>
        <div className="body-base space-y-4">
          <p>Enviamos para todo o Brasil com prazos que variam de acordo com a região.</p>
          <p><strong>Frete grátis</strong> para compras acima de R$ 250,00.</p>
          <p>O prazo de processamento é de 1 a 2 dias úteis após a confirmação do pagamento.</p>
          <p>Você receberá um código de rastreamento por e-mail assim que o pedido for despachado.</p>
        </div>
      </div>
    </div>
  )
}
