"use client"

import { useRef } from "react"
import { Plus, X } from "lucide-react"

interface Props {
  createCoupon: (formData: FormData) => Promise<void>
}

export function NewCouponDialog({ createCoupon }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="btn-rose text-sm py-2.5 px-4"
      >
        <Plus className="w-4 h-4" /> Novo
      </button>

      <dialog ref={dialogRef} className="rounded-2xl p-6 max-w-md w-[90vw] backdrop:bg-black/40 bg-white border-0 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="display-sm">Novo Cupom</h2>
          <button type="button" onClick={() => dialogRef.current?.close()} className="p-1 text-espresso-400 hover:text-espresso-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form action={async (formData: FormData) => {
          await createCoupon(formData)
          dialogRef.current?.close()
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Código *</label>
            <input name="code" required className="input-clean" placeholder="EX: BLACK10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Tipo *</label>
              <select name="type" defaultValue="percentage" className="input-clean">
                <option value="percentage">Percentual (%)</option>
                <option value="fixed">Valor Fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Valor *</label>
              <input name="value" required type="number" step="0.01" min="0" className="input-clean" placeholder="10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Pedido mínimo</label>
              <input name="minValue" type="number" step="0.01" min="0" className="input-clean" placeholder="R$ 100" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Máx. usos</label>
              <input name="maxUses" type="number" min="1" className="input-clean" placeholder="Ilimitado" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Início</label>
              <input name="startsAt" type="datetime-local" className="input-clean" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Expira em</label>
              <input name="expiresAt" type="datetime-local" className="input-clean" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="active" value="true" id="active" defaultChecked className="w-5 h-5 rounded border-pearl-300 text-berry-600 focus:ring-berry-500" />
            <label htmlFor="active" className="text-sm text-espresso-700">Ativo</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-rose text-sm flex-1">Criar</button>
            <button type="button" onClick={() => dialogRef.current?.close()} className="btn-outline text-sm flex-1">Cancelar</button>
          </div>
        </form>
      </dialog>
    </>
  )
}
