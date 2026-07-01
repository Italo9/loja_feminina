import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { PriceCalculator } from "@/components/admin/PriceCalculator"

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  const categories = await prisma.category.findMany({ where: { parentId: null }, orderBy: { order: "asc" } })
  const suppliers = await prisma.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" } })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/produtos" className="p-2 -ml-2 text-espresso-500"><ChevronLeft className="w-5 h-5" /></Link>
        <h1 className="display-md text-espresso-900">Editar Produto</h1>
      </div>

      <form action={async (formData: FormData) => {
        "use server"
        const { auth } = await import("@/lib/auth")
        const session = await auth()
        const role = (session?.user as { role?: string })?.role
        if (role !== "ADMIN") throw new Error("Unauthorized")
        const { prisma } = await import("@/lib/db")
        const { revalidatePath } = await import("next/cache")
        const { redirect } = await import("next/navigation")
        await prisma.product.update({
          where: { id },
          data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string),
            compareAt: formData.get("compareAt") ? parseFloat(formData.get("compareAt") as string) : null,
            cost: formData.get("cost") ? parseFloat(formData.get("cost") as string) : null,
            markup: formData.get("markup") ? parseFloat(formData.get("markup") as string) : 0,
            source: (formData.get("source") as string) || "own",
            supplierId: (formData.get("supplierId") as string) || null,
            sku: (formData.get("sku") as string) || null,
            categoryId: formData.get("categoryId") as string,
            badge: (formData.get("badge") as string) || null,
            featured: formData.get("featured") === "true",
            active: formData.get("active") === "true",
            regions: (formData.get("regions") as string) || "",
          },
        })
        revalidatePath("/admin/produtos")
        redirect("/admin/produtos")
      }} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Nome</label>
          <input name="name" required defaultValue={product.name} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Descrição</label>
          <textarea name="description" required rows={4} defaultValue={product.description} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] resize-none" />
        </div>

        {/* Estados onde o produto aparece */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Regiões (siglas, ex: SP,RJ,MG — vazio = todo Brasil)</label>
          <input name="regions" defaultValue={product.regions} placeholder="SP,RJ,MG" className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px] font-mono uppercase tracking-widest" />
          <p className="text-xs text-espresso-300 mt-1">Digite as siglas dos estados separadas por vírgula. Deixe em branco para vender em todo Brasil.</p>
        </div>

        {/* Origem do produto */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Origem</label>
          <div className="flex gap-3">
            <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer ${product.source === "own" ? "border-rose-300 bg-rose-50" : "border-pearl-200 bg-white"}`}>
              <input type="radio" name="source" value="own" defaultChecked={product.source === "own"} className="sr-only" />
              <span className="text-sm font-medium text-espresso-700">Estoque próprio</span>
            </label>
            <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer ${product.source === "dropship" ? "border-rose-300 bg-rose-50" : "border-pearl-200 bg-white"}`}>
              <input type="radio" name="source" value="dropship" defaultChecked={product.source === "dropship"} className="sr-only" />
              <span className="text-sm font-medium text-espresso-700">Dropship</span>
            </label>
          </div>
        </div>

        {/* Fornecedor (dropship) */}
        {suppliers.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Fornecedor (dropship)</label>
            <select name="supplierId" defaultValue={product.supplierId ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]">
              <option value="">Nenhum (estoque próprio)</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço de venda (R$)</label>
            <input name="price" type="number" step="0.01" required defaultValue={product.price} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço original</label>
            <input name="compareAt" type="number" step="0.01" defaultValue={product.compareAt ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Custo (R$)</label>
            <input name="cost" type="number" step="0.01" defaultValue={product.cost ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Markup (%)</label>
            <input name="markup" type="number" step="0.01" defaultValue={product.markup ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" placeholder="100 a 1550" />
          </div>
        </div>

        <PriceCalculator />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">SKU</label>
          <input name="sku" defaultValue={product.sku ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Categoria</label>
          <select name="categoryId" required defaultValue={product.categoryId} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]">
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Badge</label>
          <select name="badge" defaultValue={product.badge ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]">
            <option value="">Nenhum</option>
            <option value="novidade">Novidade</option>
            <option value="oferta">Oferta</option>
            <option value="destaque">Destaque</option>
            <option value="mais-vendido">Mais vendido</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="featured" value="true" id="featured" defaultChecked={product.featured} className="w-5 h-5 rounded border-pearl-300 text-berry-600" />
          <label htmlFor="featured" className="text-sm text-espresso-700">Destaque</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="active" value="true" id="active" defaultChecked={product.active} className="w-5 h-5 rounded border-pearl-300 text-berry-600" />
          <label htmlFor="active" className="text-sm text-espresso-700">Ativo</label>
        </div>

        <button type="submit" className="w-full py-3.5 rounded-full bg-berry-600 text-white font-bold text-[15px] hover:bg-berry-500 transition-colors active:scale-[0.97]">
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}
