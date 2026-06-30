import Link from "next/link"
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface Props {
  searchParams: Promise<{ edit?: string }>
}

export default async function AddressesPage({ searchParams }: Props) {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="bg-cream-100 min-h-screen">
        <div className="container-narrow py-8">
          <Breadcrumbs items={[{ label: "Conta", href: "/conta" }, { label: "Meus Endereços" }]} />
          <div className="surface max-w-md mx-auto text-center p-8">
            <MapPin className="w-12 h-12 text-rose-200 mx-auto mb-4" />
            <p className="body-base mb-4">Faça login para gerenciar seus endereços.</p>
            <Link href="/login?callbackUrl=/conta/enderecos" className="btn-rose">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { edit: editId } = await searchParams
  const userId = session.user.id

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  })

  const editingAddress = editId
    ? addresses.find((a) => a.id === editId) ?? null
    : null

  async function deleteAddress(formData: FormData) {
    "use server"
    const addrId = formData.get("addressId") as string
    const addr = await prisma.address.findUnique({ where: { id: addrId } })
    if (!addr || addr.userId !== userId) return
    await prisma.address.delete({ where: { id: addrId } })
    revalidatePath("/conta/enderecos")
  }

  async function saveAddress(formData: FormData) {
    "use server"
    const eId = formData.get("editId") as string | null
    const label = formData.get("label") as string
    const receiver = formData.get("receiver") as string
    const zipCode = formData.get("zipCode") as string
    const street = formData.get("street") as string
    const number = formData.get("number") as string
    const complement = formData.get("complement") as string
    const neighborhood = formData.get("neighborhood") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string

    if (!label || !receiver || !zipCode || !street || !number || !neighborhood || !city || !state) return

    if (eId) {
      const existing = await prisma.address.findUnique({ where: { id: eId } })
      if (!existing || existing.userId !== userId) return
      await prisma.address.update({
        where: { id: eId },
        data: { label, receiver, zipCode, street, number, complement: complement || null, neighborhood, city, state },
      })
    } else {
      await prisma.address.create({
        data: { userId, label, receiver, zipCode, street, number, complement: complement || null, neighborhood, city, state },
      })
    }

    revalidatePath("/conta/enderecos")
    redirect("/conta/enderecos")
  }

  const fieldClass = "w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-200 text-[16px] text-espresso-700 placeholder:text-espresso-300 focus:outline-none focus:border-rose-300 transition-colors"

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8">
        <Breadcrumbs items={[{ label: "Conta", href: "/conta" }, { label: "Meus Endereços" }]} />

        <h1 className="display-lg mb-8">Meus Endereços</h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {/* Address list */}
          {addresses.length === 0 && !editingAddress && (
            <p className="text-espresso-400 col-span-full surface p-6 text-center">
              Nenhum endereço cadastrado ainda.
            </p>
          )}

          {addresses.map((addr) => (
            <div key={addr.id} className="surface relative">
              <div className="absolute top-3 right-3 flex gap-1">
                <Link
                  href={`/conta/enderecos?edit=${addr.id}`}
                  className="p-1.5 text-espresso-400 hover:text-rose-500 transition-colors"
                  aria-label="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <form action={deleteAddress}>
                  <input type="hidden" name="addressId" value={addr.id} />
                  <button
                    type="submit"
                    className="p-1.5 text-espresso-400 hover:text-red-500 transition-colors"
                    aria-label="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-espresso-700 mb-1">{addr.label}</p>
                  <p className="text-sm text-espresso-500">{addr.receiver}</p>
                  <p className="text-sm text-espresso-400">
                    {addr.street}, {addr.number}
                    {addr.complement ? ` — ${addr.complement}` : ""}
                  </p>
                  <p className="text-sm text-espresso-400">
                    {addr.neighborhood} — {addr.city}/{addr.state}
                  </p>
                  <p className="text-xs text-espresso-300 mt-1">CEP: {addr.zipCode}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Form: Add new or edit existing */}
          <div className="surface col-span-full md:col-span-1">
            <form action={saveAddress} className="space-y-4">
              {editingAddress && <input type="hidden" name="editId" value={editingAddress.id} />}
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-rose-400" />
                <p className="font-semibold text-espresso-700">
                  {editingAddress ? "Editar endereço" : "Novo endereço"}
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                  Nome do endereço
                </label>
                <input
                  name="label"
                  defaultValue={editingAddress?.label ?? ""}
                  placeholder="Ex: Casa, Trabalho"
                  required
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                  Destinatário
                </label>
                <input
                  name="receiver"
                  defaultValue={editingAddress?.receiver ?? ""}
                  placeholder="Nome de quem vai receber"
                  required
                  className={fieldClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                    CEP
                  </label>
                  <input
                    name="zipCode"
                    defaultValue={editingAddress?.zipCode ?? ""}
                    placeholder="00000-000"
                    required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                    Número
                  </label>
                  <input
                    name="number"
                    defaultValue={editingAddress?.number ?? ""}
                    placeholder="123"
                    required
                    className={fieldClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                  Rua
                </label>
                <input
                  name="street"
                  defaultValue={editingAddress?.street ?? ""}
                  placeholder="Rua, Avenida..."
                  required
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                  Complemento
                </label>
                <input
                  name="complement"
                  defaultValue={editingAddress?.complement ?? ""}
                  placeholder="Apto, bloco..."
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                  Bairro
                </label>
                <input
                  name="neighborhood"
                  defaultValue={editingAddress?.neighborhood ?? ""}
                  placeholder="Bairro"
                  required
                  className={fieldClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                    Cidade
                  </label>
                  <input
                    name="city"
                    defaultValue={editingAddress?.city ?? ""}
                    placeholder="Cidade"
                    required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] text-espresso-400 mb-1.5 font-medium">
                    Estado
                  </label>
                  <input
                    name="state"
                    defaultValue={editingAddress?.state ?? ""}
                    placeholder="UF"
                    required
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-rose flex-1">
                  {editingAddress ? "Salvar alterações" : "Adicionar endereço"}
                </button>
                {editingAddress && (
                  <Link href="/conta/enderecos" className="btn-ghost">
                    Cancelar
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
