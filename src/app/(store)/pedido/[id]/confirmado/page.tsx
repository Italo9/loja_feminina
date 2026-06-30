import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Truck, Clock, CreditCard } from "lucide-react"
import { prisma } from "@/lib/db"

interface Props { params: Promise<{ id: string }> }

const PAYMENT_LABELS: Record<string, string> = {
  pix: "Pix",
  card: "Cartão",
  boleto: "Boleto",
}

export default async function OrderConfirmedPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      dropshipItems: { include: { supplier: { select: { name: true } } } },
    },
  })
  if (!order) notFound()

  const address = JSON.parse(order.shippingAddress)
  const dropshipItems = order.items.filter((i) => i.source === "dropship")

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="display-lg mb-2">Pedido Confirmado!</h1>
        <p className="body-base mb-8">Seu pedido #{order.id.slice(-8)} foi recebido e está sendo processado.</p>

        <div className="surface p-5 text-left space-y-4 !rounded-2xl mb-6">
          <h2 className="display-sm flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-400" />
            Resumo
          </h2>
          <div className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-1 border-b border-cream-100">
                <div>
                  <span className="text-espresso-700">{item.productName}</span>
                  {item.variantInfo && <span className="text-xs text-espresso-400 ml-1">({item.variantInfo})</span>}
                  <span className="text-[11px] text-espresso-400 ml-2">x{item.quantity}</span>
                  {item.source === "dropship" && (
                    <span className="text-[10px] font-medium text-rose-500 ml-1">Dropship</span>
                  )}
                </div>
                <span className="text-espresso-700">R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t border-cream-200">
            <span className="text-sm font-medium text-espresso-700">Total</span>
            <span className="price-lg text-espresso-800">R$ {order.total.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-espresso-400">
            Pagamento: {PAYMENT_LABELS[order.paymentMethod ?? ""] ?? order.paymentMethod}
          </p>
        </div>

        <div className="surface p-5 text-left space-y-3 !rounded-2xl mb-6">
          <h2 className="display-sm flex items-center gap-2">
            <Truck className="w-5 h-5 text-rose-400" />
            Entrega
          </h2>
          <p className="text-sm text-espresso-700">
            {address.receiver}
          </p>
          <p className="text-sm text-espresso-500">
            {address.street}, {address.number}
            {address.complement ? ` - ${address.complement}` : ""}
          </p>
          <p className="text-sm text-espresso-500">
            {address.neighborhood} - {address.city}/{address.state}
          </p>
          <p className="text-sm text-espresso-400">CEP: {address.zipCode}</p>
        </div>

        {dropshipItems.length > 0 && (
          <div className="surface p-5 text-left space-y-3 !rounded-2xl mb-6">
            <h2 className="display-sm flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-500" />
              Itens Dropship ({dropshipItems.length})
            </h2>
            <p className="text-xs text-espresso-400">
              Estes itens serão enviados diretamente pelos fornecedores e podem ter prazos de entrega diferentes.
            </p>
            {order.dropshipItems.map((di) => (
              <div key={di.id} className="text-xs text-espresso-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                {di.supplier.name} — Status: {di.status}
              </div>
            ))}
          </div>
        )}

        <Link href="/catalogo" className="btn-rose inline-flex items-center gap-2 text-sm">
          Continuar Comprando
        </Link>
      </div>
    </div>
  )
}
