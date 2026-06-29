import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente", confirmed: "Confirmado", processing: "Preparando",
  shipped: "Enviado", delivered: "Entregue", cancelled: "Cancelado",
}

const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed", confirmed: "processing", processing: "shipped", shipped: "delivered",
}

interface Props { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) notFound()
  const o = order // non-null after notFound()

  const nextStatus = NEXT_STATUS[o.status]

  async function advanceStatus() {
    "use server"
    await prisma.order.update({
      where: { id },
      data: { status: NEXT_STATUS[o.status] ?? o.status },
    })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  async function cancelOrder() {
    "use server"
    await prisma.order.update({
      where: { id },
      data: { status: "cancelled" },
    })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  async function saveTracking(formData: FormData) {
    "use server"
    const code = formData.get("tracking") as string
    if (code) {
      await prisma.order.update({
        where: { id },
        data: { trackingCode: code },
      })
      revalidatePath(`/admin/pedidos/${id}`)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pedidos" className="p-2 -ml-2 text-espresso-500"><ChevronLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="display-sm text-espresso-900">Pedido #{order.id.slice(-8)}</h1>
          <p className="text-xs text-espresso-400">{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-white rounded-2xl p-4 border border-pearl-200 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Status</p>
        <p className="text-lg font-bold text-espresso-900 mb-3">{STATUS_LABELS[o.status] ?? o.status}</p>
        {nextStatus && (
          <form action={advanceStatus}>
            <button type="submit" className="w-full py-3 rounded-full bg-berry-600 text-white font-bold text-sm hover:bg-berry-500 transition-colors">
              Avançar para: {STATUS_LABELS[nextStatus]}
            </button>
          </form>
        )}
      </div>

      {/* Tracking */}
      {o.status === "shipped" && (
        <div className="bg-white rounded-2xl p-4 border border-pearl-200 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-espresso-400 mb-3">Código de rastreio</p>
          <form action={saveTracking} className="flex gap-2">
            <input name="tracking" defaultValue={o.trackingCode ?? ""} placeholder="Código de rastreio" className="flex-1 px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
            <button type="submit" className="px-4 py-3 rounded-full bg-berry-600 text-white font-bold text-sm">Salvar</button>
          </form>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-pearl-200 overflow-hidden mb-4">
        <div className="p-4 border-b border-pearl-100">
          <p className="text-xs font-bold uppercase tracking-wider text-espresso-400">Itens</p>
        </div>
        {o.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 border-b border-pearl-100 last:border-0">
            {item.image && <img src={item.image} alt={item.productName} className="w-12 h-16 rounded-lg object-cover bg-pearl-100" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-espresso-900 truncate">{item.productName}</p>
              {item.variantInfo && <p className="text-xs text-espresso-400">{item.variantInfo}</p>}
              <p className="text-xs text-espresso-500 mt-0.5">Qtd: {item.quantity} × R$ {item.price.toFixed(2)}</p>
            </div>
            <span className="price-sm text-espresso-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-white rounded-2xl p-4 border border-pearl-200 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-espresso-500">Subtotal</span><span className="text-espresso-900">R$ {o.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-espresso-500">Frete</span><span className="text-espresso-900">R$ {o.shippingCost.toFixed(2)}</span></div>
        <hr className="rule" />
        <div className="flex justify-between text-base font-bold"><span className="text-espresso-900">Total</span><span className="text-espresso-900">R$ {o.total.toFixed(2)}</span></div>
      </div>

      {/* Cancel button */}
      {o.status === "pending" && (
        <form action={cancelOrder} className="mt-4">
          <button type="submit" className="w-full py-3 rounded-full bg-espresso-100 text-espresso-600 font-bold text-sm hover:bg-espresso-200 transition-colors">
            Cancelar pedido
          </button>
        </form>
      )}
    </div>
  )
}
