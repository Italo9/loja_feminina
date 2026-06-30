import { prisma } from "@/lib/db"
import Link from "next/link"
import { Package, ShoppingBag, DollarSign, Clock, Plus } from "lucide-react"

export default async function AdminDashboard() {
  const [totalProducts, pendingOrders, revenue] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "paid" } }),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayOrders = await prisma.order.count({
    where: { createdAt: { gte: today } },
  })

  const KPIS = [
    { label: "Produtos ativos", value: totalProducts, icon: Package, color: "bg-rose-100 text-rose-600" },
    { label: "Pedidos hoje", value: todayOrders, icon: Clock, color: "bg-gold-100 text-gold-700" },
    { label: "Faturamento", value: `R$ ${(revenue._sum.total ?? 0).toFixed(2)}`, icon: DollarSign, color: "bg-rose-100 text-rose-600" },
    { label: "Pendentes", value: pendingOrders, icon: ShoppingBag, color: "bg-gold-100 text-gold-700" },
  ]

  return (
    <div>
      <h1 className="display-md mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="surface p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">{kpi.label}</p>
            <p className="text-xl font-medium text-espresso-800">{kpi.value}</p>
          </div>
        ))}
      </div>

      <h2 className="display-sm mt-8 mb-4">Ações rápidas</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/admin/produtos/novo" className="surface p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-espresso-700">Novo produto</span>
        </Link>
        <Link href="/admin/pedidos" className="surface p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-espresso-700">Ver pedidos</span>
        </Link>
      </div>
    </div>
  )
}
