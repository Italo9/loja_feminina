import { prisma } from "@/lib/db"
import { createSupplier } from "@/lib/admin-actions"
import Link from "next/link"
import { Pencil, ExternalLink, Package } from "lucide-react"
import { NewSupplierDialog } from "./NewSupplierDialog"

export default async function AdminSuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: { _count: { select: { products: true, dropshipOrders: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="display-md">Fornecedores</h1>
        <NewSupplierDialog createSupplier={createSupplier} />
      </div>

      {suppliers.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-cream-300 mx-auto mb-4" />
          <p className="body-base mb-4">Nenhum fornecedor cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="surface p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-espresso-800">{supplier.name}</p>
                  <p className="text-[11px] text-espresso-400">{supplier.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!supplier.active && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-espresso-100 text-espresso-500">Inativo</span>
                  )}
                  <Link href={`/admin/fornecedores/${supplier.id}`} className="p-2 text-espresso-400 hover:text-rose-500 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-espresso-400">
                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {supplier._count.products} produtos</span>
                <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {supplier._count.dropshipOrders} pedidos</span>
              </div>
              {supplier.apiUrl && (
                <p className="text-[10px] text-espresso-400 truncate">API: {supplier.apiUrl}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
