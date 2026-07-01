import { prisma } from "@/lib/db"

const SETTINGS = [
  {
    key: "free_shipping_threshold",
    label: "Valor mínimo para frete grátis (R$)",
    type: "number",
    default: "250",
    hint: "Compras acima deste valor têm frete grátis",
  },
  {
    key: "free_shipping_message",
    label: "Mensagem de frete grátis",
    type: "text",
    default: "Frete grátis acima de",
    hint: "Exibida no topo do site e no carrinho",
  },
  {
    key: "shipping_info",
    label: "Informação de envio",
    type: "text",
    default: "Enviamos para todo Brasil",
    hint: "Exibida no hero e footer",
  },
  {
    key: "whatsapp_number",
    label: "Número WhatsApp (55+)",
    type: "text",
    default: "5571997006042",
    hint: "Número para contato via WhatsApp",
  },
]

export default async function AdminConfigPage() {
  const dbSettings = await prisma.setting.findMany()
  const values: Record<string, string> = {}
  for (const s of SETTINGS) {
    values[s.key] = dbSettings.find((d) => d.key === s.key)?.value || s.default
  }

  return (
    <div>
      <h1 className="display-md mb-6">Configurações</h1>

      <form
        action={async (formData: FormData) => {
          "use server"
          const { auth } = await import("@/lib/auth")
          const session = await auth()
          if ((session?.user as { role?: string })?.role !== "ADMIN") return
          const { prisma } = await import("@/lib/db")
          const { revalidatePath } = await import("next/cache")

          for (const { key } of SETTINGS) {
            const value = (formData.get(key) as string) || ""
            await prisma.setting.upsert({
              where: { key },
              update: { value },
              create: { key, value },
            })
          }
          revalidatePath("/admin/config")
        }}
        className="space-y-6"
      >
        {SETTINGS.map(({ key, label, type, default: def, hint }) => (
          <div key={key} className="surface p-5">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-gold-600 mb-2">
              {label}
            </label>
            <input
              name={key}
              type={type}
              defaultValue={values[key]}
              className="w-full px-4 py-3 rounded-xl bg-pearl-50 border border-pearl-200 text-[16px] text-plum-700 focus:outline-none focus:border-rose-300"
            />
            <p className="text-[10px] text-plum-400 mt-1.5">{hint}</p>
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-rose-500 text-white font-bold text-[15px] hover:bg-rose-600 transition-colors active:scale-[0.97]"
        >
          Salvar Configurações
        </button>
      </form>
    </div>
  )
}
