import Link from "next/link"
import { prisma } from "@/lib/db"

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  processing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-topaz-100 text-topaz-700",
  confirmed: "bg-sage-100 text-sage-700",
  processing: "bg-berry-100 text-berry-600",
  shipped: "bg-berry-100 text-berry-600",
  delivered: "bg-sage-100 text-sage-700",
  cancelled: "bg-espresso-100 text-espresso-500",
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div>
      <h1 className="display-md text-espresso-900 mb-6">Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="body-base text-espresso-400">Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/pedidos/${order.id}`} className="block bg-white rounded-2xl p-4 border border-pearl-200 hover:border-berry-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-espresso-400">#{order.id.slice(-8)}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-pearl-100 text-espresso-500"}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-espresso-900 mb-1">
                {order.items.length} {order.items.length === 1 ? "item" : "itens"}
              </p>
              <div className="flex items-center justify-between">
                <span className="price-sm text-espresso-900">R$ {order.total.toFixed(2)}</span>
                <span className="text-[11px] text-espresso-400">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
