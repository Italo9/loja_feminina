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
  pending: "bg-gold-100 text-gold-700",
  confirmed: "bg-rose-100 text-rose-600",
  processing: "bg-rose-100 text-rose-600",
  shipped: "bg-gold-100 text-gold-700",
  delivered: "bg-green-100 text-green-700",
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
      <h1 className="display-md mb-6">Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="body-base">Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/pedidos/${order.id}`} className="block surface p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-espresso-400">#{order.id.slice(-8)}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-cream-100 text-espresso-500"}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <p className="text-sm font-medium text-espresso-700 mb-1">
                {order.items.length} {order.items.length === 1 ? "item" : "itens"}
              </p>
              <div className="flex items-center justify-between">
                <span className="price-sm text-espresso-800">R$ {order.total.toFixed(2)}</span>
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
