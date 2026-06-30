"use client"

import { useRef } from "react"
import { Plus, X } from "lucide-react"

interface Props {
  createSupplier: (formData: FormData) => Promise<void>
}

export function NewSupplierDialog({ createSupplier }: Props) {
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
          <h2 className="display-sm">Novo Fornecedor</h2>
          <button type="button" onClick={() => dialogRef.current?.close()} className="p-1 text-espresso-400 hover:text-espresso-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form action={async (formData: FormData) => {
          await createSupplier(formData)
          dialogRef.current?.close()
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Nome *</label>
            <input name="name" required className="input-clean" placeholder="Nome do fornecedor" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Slug</label>
            <input name="slug" className="input-clean" placeholder="slug (automático)" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">URL da API</label>
            <input name="apiUrl" className="input-clean" placeholder="https://api.fornecedor.com/v1" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Chave API</label>
            <input name="apiKey" className="input-clean" placeholder="sk_live_..." />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Observações</label>
            <textarea name="notes" rows={2} className="input-clean resize-none" placeholder="Notas sobre este fornecedor..." />
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
