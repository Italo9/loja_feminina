import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { updateCoupon } from "@/lib/admin-actions"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Props { params: Promise<{ id: string }> }

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params
  const coupon = await prisma.coupon.findUnique({ where: { id } })
  if (!coupon) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/cupons" className="p-2 -ml-2 text-espresso-500">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="display-md text-espresso-900">Editar Cupom</h1>
      </div>

      <form action={updateCoupon} className="space-y-5">
        <input type="hidden" name="id" value={coupon.id} />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Código *</label>
          <input name="code" required defaultValue={coupon.code} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Tipo *</label>
            <select name="type" defaultValue={coupon.type} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200">
              <option value="percentage">Percentual (%)</option>
              <option value="fixed">Valor Fixo (R$)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Valor *</label>
            <input name="value" required type="number" step="0.01" min="0" defaultValue={coupon.value} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Pedido mínimo</label>
            <input name="minValue" type="number" step="0.01" min="0" defaultValue={coupon.minValue ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="R$ 100" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Máx. usos</label>
            <input name="maxUses" type="number" min="1" defaultValue={coupon.maxUses ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="Ilimitado" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Início</label>
            <input
              name="startsAt"
              type="datetime-local"
              defaultValue={coupon.startsAt ? coupon.startsAt.toISOString().slice(0, 16) : ""}
              className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Expira em</label>
            <input
              name="expiresAt"
              type="datetime-local"
              defaultValue={coupon.expiresAt ? coupon.expiresAt.toISOString().slice(0, 16) : ""}
              className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="active" value="true" id="active" defaultChecked={coupon.active} className="w-5 h-5 rounded border-pearl-300 text-berry-600 focus:ring-berry-500" />
          <label htmlFor="active" className="text-sm text-espresso-700">Ativo</label>
        </div>

        <button type="submit" className="w-full py-3.5 rounded-full bg-berry-600 text-white font-bold text-[15px] hover:bg-berry-500 transition-colors active:scale-[0.97]">
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}
