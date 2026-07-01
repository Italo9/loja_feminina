import { prisma } from "@/lib/db"
import { createProduct } from "@/lib/admin-actions"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { parentId: null }, orderBy: { order: "asc" } })
  const suppliers = await prisma.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" } })

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

        {/* Origem do produto */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Origem</label>
          <div className="flex gap-3">
            <label className="flex-1 flex items-center gap-2 p-3 rounded-xl border-2 border-pearl-200 bg-white cursor-pointer has-[:checked]:border-rose-300 has-[:checked]:bg-rose-50">
              <input type="radio" name="source" value="own" defaultChecked className="sr-only" />
              <span className="text-sm font-medium text-espresso-700">Estoque próprio</span>
            </label>
            <label className="flex-1 flex items-center gap-2 p-3 rounded-xl border-2 border-pearl-200 bg-white cursor-pointer has-[:checked]:border-rose-300 has-[:checked]:bg-rose-50">
              <input type="radio" name="source" value="dropship" className="sr-only" />
              <span className="text-sm font-medium text-espresso-700">Dropship</span>
            </label>
          </div>
        </div>

        {/* Fornecedor (dropship) */}
        {suppliers.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Fornecedor (dropship)</label>
            <select name="supplierId" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200">
              <option value="">Nenhum (estoque próprio)</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço de venda (R$)</label>
            <input name="price" type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="109.90" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço original</label>
            <input name="compareAt" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="149.90 (opcional)" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Custo (R$)</label>
            <input name="cost" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="Custo do fornecedor" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Markup (%)</label>
            <input name="markup" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="100 a 1550" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">SKU</label>
          <input name="sku" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="SKU-001" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Regiões (siglas, ex: SP,RJ,MG — vazio = todo Brasil)</label>
          <input name="regions" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] font-mono uppercase tracking-widest text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:ring-2 focus:ring-berry-200" placeholder="SP,RJ,MG" />
          <p className="text-xs text-espresso-300 mt-1">Digite as siglas dos estados separadas por vírgula. Deixe em branco para vender em todo Brasil.</p>
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
            <option value="mais-vendido">Mais vendido</option>
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
