import Image from "next/image"
import Link from "next/link"
import { Plus, Pencil, EyeOff, Package } from "lucide-react"
import { prisma } from "@/lib/db"
import { DeleteProductButton } from "./DeleteProductButton"
import { ToggleActiveButton } from "./ToggleActiveButton"
import { InlineCategoryEdit } from "./InlineCategoryEdit"

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { images: true, variants: true, category: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="display-md">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-rose text-sm py-2.5 px-4">
          <Plus className="w-4 h-4" /> Novo
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-cream-300 mx-auto mb-4" />
          <p className="body-base mb-4">Nenhum produto cadastrado</p>
          <Link href="/admin/produtos/novo" className="btn-rose text-sm">
            <Plus className="w-4 h-4" /> Criar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
            const image = product.images?.[0]?.url
            return (
              <div key={product.id} className="surface p-3 flex items-center gap-3">
                <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                  {image ? <Image src={image} alt={product.name} fill sizes="56px" className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-espresso-300">Sem foto</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-espresso-800 truncate">{product.name}</p>
                    {!product.active && <EyeOff className="w-3.5 h-3.5 text-espresso-300 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-plum-400">
                    <InlineCategoryEdit
                      productId={product.id}
                      currentCategoryId={product.categoryId}
                      categories={categories}
                    />
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="price-sm text-espresso-700">R$ {product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-espresso-400">• Estoque: {totalStock}</span>
                    {product.badge && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/admin/produtos/${product.id}/editar`} className="p-2 text-plum-400 hover:text-rose-500 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <ToggleActiveButton productId={product.id} active={product.active} />
                <DeleteProductButton productId={product.id} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
