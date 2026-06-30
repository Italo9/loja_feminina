import { prisma } from "@/lib/db"
import { createCoupon } from "@/lib/admin-actions"
import Link from "next/link"
import { Pencil, Ticket, Percent, DollarSign } from "lucide-react"
import { NewCouponDialog } from "./NewCouponDialog"

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="display-md">Cupons</h1>
        <NewCouponDialog createCoupon={createCoupon} />
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="w-12 h-12 text-cream-300 mx-auto mb-4" />
          <p className="body-base mb-4">Nenhum cupom cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="surface p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-espresso-800 font-mono">{coupon.code}</p>
                    {coupon.type === "percentage" ? (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {coupon.value}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        R$ {coupon.value.toFixed(2)}
                      </span>
                    )}
                    {!coupon.active && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-espresso-100 text-espresso-500">Inativo</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/cupons/${coupon.id}`} className="p-2 text-espresso-400 hover:text-rose-500 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-espresso-400">
                <span className="flex items-center gap-1">
                  {coupon.type === "percentage" ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                  {coupon.type === "percentage" ? `${coupon.value}% de desconto` : `R$ ${coupon.value.toFixed(2)} de desconto`}
                </span>
                <span>{coupon.usedCount} uso{coupon.usedCount !== 1 ? "s" : ""}</span>
                {coupon.maxUses && <span>máx {coupon.maxUses}</span>}
              </div>
              {coupon.minValue && (
                <p className="text-[10px] text-espresso-400">Pedido mínimo: R$ {coupon.minValue.toFixed(2)}</p>
              )}
              {coupon.expiresAt && (
                <p className="text-[10px] text-espresso-400">
                  Expira em {coupon.expiresAt.toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
