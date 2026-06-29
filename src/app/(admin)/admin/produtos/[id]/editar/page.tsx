import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  const categories = await prisma.category.findMany({ where: { parentId: null }, orderBy: { order: "asc" } })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/produtos" className="p-2 -ml-2 text-espresso-500"><ChevronLeft className="w-5 h-5" /></Link>
        <h1 className="display-md text-espresso-900">Editar Produto</h1>
      </div>

      <form action={async (formData: FormData) => {
        "use server"
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
            categoryId: formData.get("categoryId") as string,
            badge: (formData.get("badge") as string) || null,
            featured: formData.get("featured") === "true",
            active: formData.get("active") === "true",
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço (R$)</label>
            <input name="price" type="number" step="0.01" required defaultValue={product.price} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-400 mb-2">Preço original</label>
            <input name="compareAt" type="number" step="0.01" defaultValue={product.compareAt ?? ""} className="w-full px-4 py-3 rounded-xl bg-white border border-pearl-200 text-[16px]" />
          </div>
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
