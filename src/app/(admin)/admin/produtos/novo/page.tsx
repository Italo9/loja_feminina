import { prisma } from "@/lib/db"
import { createProduct } from "@/lib/admin-actions"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { parentId: null }, orderBy: { order: "asc" } })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/produtos" className="p-2 -ml-2 text-espresso-500">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="display-md text-espresso-900">Novo Produto</h1>
      </div>

      <form action={createProduct} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Nome</label>
          <input name="name" required className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="Nome do produto" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Slug</label>
          <input name="slug" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="slug-do-produto (automático se vazio)" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Descrição</label>
          <textarea name="description" required rows={4} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:ring-2 focus:ring-berry-200 resize-none" placeholder="Descreva o produto..." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço (R$)</label>
            <input name="price" type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="109.90" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço original</label>
            <input name="compareAt" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="149.90 (opcional)" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Categoria</label>
          <select name="categoryId" required className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200">
            <option value="">Selecione...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Badge</label>
          <select name="badge" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200">
            <option value="">Nenhum</option>
            <option value="novidade">Novidade</option>
            <option value="oferta">Oferta</option>
            <option value="destaque">Destaque</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="featured" value="true" id="featured" className="w-5 h-5 rounded border-pearl-300 text-berry-600 focus:ring-berry-500" />
          <label htmlFor="featured" className="text-sm text-espresso-700">Produto em destaque</label>
        </div>

        <button type="submit" className="w-full py-3.5 rounded-full bg-berry-600 text-white font-bold text-[15px] hover:bg-berry-500 transition-colors active:scale-[0.97]">
          Criar Produto
        </button>
      </form>
    </div>
  )
}
