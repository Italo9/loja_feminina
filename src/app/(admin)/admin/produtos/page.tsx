import Link from "next/link"
import { Plus, Pencil, EyeOff, Package } from "lucide-react"
import { prisma } from "@/lib/db"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: true, variants: true, category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="display-md text-espresso-900">Produtos</h1>
        <Link href="/admin/produtos/novo" className="flex items-center gap-2 bg-berry-600 text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-berry-500 transition-colors">
          <Plus className="w-4 h-4" /> Novo
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-espresso-200 mx-auto mb-4" />
          <p className="body-base text-espresso-400 mb-4">Nenhum produto cadastrado</p>
          <Link href="/admin/produtos/novo" className="inline-flex items-center gap-2 bg-berry-600 text-white px-6 py-3 rounded-full text-sm font-bold">
            <Plus className="w-4 h-4" /> Criar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
            const image = product.images?.[0]?.url
            return (
              <div key={product.id} className="bg-white rounded-2xl p-3 border border-pearl-200 flex items-center gap-3">
                <div className="w-14 h-18 rounded-lg overflow-hidden bg-pearl-200 flex-shrink-0">
                  {image ? <img src={image} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-espresso-300">Sem foto</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-espresso-900 truncate">{product.name}</p>
                    {!product.active && <EyeOff className="w-3.5 h-3.5 text-espresso-300 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-espresso-400">{product.category?.name ?? "Sem categoria"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="price-sm text-espresso-900">R$ {product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-espresso-400">• Estoque: {totalStock}</span>
                    {product.badge && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-topaz-100 text-topaz-700">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/admin/produtos/${product.id}/editar`} className="p-2 text-espresso-400 hover:text-berry-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
