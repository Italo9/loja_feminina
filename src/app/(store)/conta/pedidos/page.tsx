import Link from "next/link"
import { Package } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export default async function OrdersPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="bg-cream-100 min-h-screen">
        <div className="container-narrow py-8">
          <Breadcrumbs items={[{ label: "Conta", href: "/conta" }, { label: "Meus Pedidos" }]} />
          <div className="surface max-w-md mx-auto text-center p-8">
            <Package className="w-12 h-12 text-rose-200 mx-auto mb-4" />
            <p className="body-base mb-4">Faça login para ver seus pedidos.</p>
            <Link href="/login?callbackUrl=/conta/pedidos" className="btn-rose">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { select: { id: true, productName: true, variantInfo: true, price: true, quantity: true, image: true, source: true } } },
    orderBy: { createdAt: "desc" },
  })

  const statusLabel: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    processing: "Em processamento",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  }

  const paymentStatusLabel: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
    refunded: "Estornado",
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Breadcrumbs items={[{ label: "Conta", href: "/conta" }, { label: "Meus Pedidos" }]} />

        <h1 className="display-lg mb-8">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="surface max-w-md mx-auto text-center p-8">
            <Package className="w-12 h-12 text-rose-200 mx-auto mb-4" />
            <p className="body-base mb-4">Você ainda não fez nenhum pedido.</p>
            <Link href="/catalogo" className="btn-rose">
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {orders.map((order) => (
              <div key={order.id} className="surface">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-espresso-400 mb-1">
                      Pedido #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-espresso-500">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.paymentStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-cream-200 text-espresso-500"
                      }`}
                    >
                      {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t border-cream-100 pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-espresso-400">
                      {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                    </p>
                    <p className="font-semibold text-espresso-700">
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
