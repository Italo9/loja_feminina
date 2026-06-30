import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export const dynamic = "force-static"

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
