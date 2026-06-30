import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { updateSupplier } from "@/lib/admin-actions"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Props { params: Promise<{ id: string }> }

export default async function EditSupplierPage({ params }: Props) {
  const { id } = await params
  const supplier = await prisma.supplier.findUnique({ where: { id } })
  if (!supplier) notFound()

  const products = await prisma.product.findMany({
    where: { supplierId: id },
    select: { id: true, name: true, slug: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/fornecedores" className="p-2 -ml-2 text-espresso-500">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="display-md text-espresso-900">Editar Fornecedor</h1>
      </div>

      <form action={updateSupplier} className="space-y-5">
        <input type="hidden" name="id" value={supplier.id} />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Nome *</label>
          <input name="name" required defaultValue={supplier.name} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Slug</label>
          <input name="slug" defaultValue={supplier.slug} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">URL da API</label>
          <input name="apiUrl" defaultValue={supplier.apiUrl ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="https://api.fornecedor.com/v1" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Chave API</label>
          <input name="apiKey" defaultValue={supplier.apiKey ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="sk_live_..." />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Observações</label>
          <textarea name="notes" rows={3} defaultValue={supplier.notes ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200 resize-none" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="active" value="true" id="active" defaultChecked={supplier.active} className="w-5 h-5 rounded border-pearl-300 text-berry-600 focus:ring-berry-500" />
          <label htmlFor="active" className="text-sm text-espresso-700">Ativo</label>
        </div>

        <button type="submit" className="w-full py-3.5 rounded-full bg-berry-600 text-white font-bold text-[15px] hover:bg-berry-500 transition-colors active:scale-[0.97]">
          Salvar Alterações
        </button>
      </form>

      {products.length > 0 && (
        <div className="mt-8">
          <h2 className="display-sm mb-3">Produtos vinculados ({products.length})</h2>
          <div className="space-y-2">
            {products.map((p) => (
              <Link key={p.id} href={`/admin/produtos/${p.id}/editar`} className="block surface p-3 text-sm text-espresso-700 hover:text-rose-600 transition-colors">
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
