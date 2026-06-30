"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Lock, CreditCard, Banknote, Truck, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"
import { createCheckoutOrder } from "@/lib/checkout"

const PAYMENT_METHODS = [
  { value: "pix", label: "Pix", icon: Banknote, description: "Pagamento instantâneo" },
  { value: "card", label: "Cartão", icon: CreditCard, description: "Crédito ou Débito" },
  { value: "boleto", label: "Boleto", icon: Banknote, description: "Vence em 3 dias" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("pix")

  const [address, setAddress] = useState({
    receiver: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const total = subtotal()
  const dropshipItems = items.filter((i) => i.source === "dropship")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError("Seu carrinho está vazio.")
      return
    }

    if (!address.receiver.trim() || !address.street.trim() || !address.number.trim() || !address.neighborhood.trim() || !address.city.trim() || !address.zipCode.trim()) {
      setError("Preencha todos os campos de endereço obrigatórios.")
      return
    }

    setLoading(true)
    const result = await createCheckoutOrder({
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        variantInfo: item.variantInfo,
        source: item.source,
      })),
      address,
      paymentMethod,
    })

    if (result.ok) {
      clearCart()
      router.push(`/pedido/${result.orderId}/confirmado`)
    } else {
      setError(result.error ?? "Erro ao criar pedido. Tente novamente.")
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="bg-cream-100 min-h-screen">
        <div className="container-narrow py-8 max-w-lg mx-auto text-center">
          <ShoppingBag className="w-12 h-12 text-cream-300 mx-auto mb-4" />
          <h1 className="display-md mb-2">Carrinho vazio</h1>
          <p className="body-base mb-6">Adicione produtos ao carrinho antes de finalizar.</p>
          <Link href="/catalogo" className="btn-rose text-sm">
            Ver Produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Link href="/carrinho" className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-rose-500 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Voltar ao carrinho
        </Link>

        <h1 className="display-lg mb-2">Checkout</h1>
        <p className="body-lg mb-8">Finalize sua compra de forma segura.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="surface p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Endereço */}
          <div className="surface p-5 space-y-4 !rounded-2xl">
            <h2 className="display-sm flex items-center gap-2">
              <Truck className="w-5 h-5 text-rose-400" />
              Endereço de entrega
            </h2>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">Destinatário *</label>
              <input value={address.receiver} onChange={(e) => setAddress({ ...address, receiver: e.target.value })} required className="input-clean" placeholder="Nome completo" />
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">Rua *</label>
                <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required className="input-clean" placeholder="Nome da rua" />
              </div>
              <div className="col-span-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">Número *</label>
                <input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} required className="input-clean" placeholder="123" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">Complemento</label>
              <input value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} className="input-clean" placeholder="Apto, Bloco, etc." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">Bairro *</label>
                <input value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} required className="input-clean" placeholder="Bairro" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">CEP *</label>
                <input value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} required className="input-clean" placeholder="00000-000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">Cidade *</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required className="input-clean" placeholder="Cidade" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-espresso-400 mb-1">Estado *</label>
                <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required className="input-clean" placeholder="UF" />
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="surface p-5 space-y-4 !rounded-2xl">
            <h2 className="display-sm flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-400" />
              Forma de pagamento
            </h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.value
                      ? "border-rose-300 bg-rose-50"
                      : "border-cream-200 bg-white hover:border-cream-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="sr-only"
                  />
                  <method.icon className={`w-5 h-5 ${paymentMethod === method.value ? "text-rose-500" : "text-espresso-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-espresso-700">{method.label}</p>
                    <p className="text-[11px] text-espresso-400">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <div className="surface p-5 space-y-3 !rounded-2xl">
            <h2 className="display-sm">Resumo do pedido</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-start justify-between gap-2 py-2 border-b border-cream-100">
                  <div className="min-w-0">
                    <p className="text-espresso-700 truncate">{item.name}</p>
                    {item.variantInfo && <p className="text-xs text-espresso-400">{item.variantInfo}</p>}
                    <span className="text-[10px] text-espresso-400">Qtd: {item.quantity}</span>
                    {item.source === "dropship" && (
                      <span className="text-[10px] font-medium text-rose-500 ml-1">Dropship</span>
                    )}
                  </div>
                  <span className="text-espresso-700 flex-shrink-0">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-cream-200">
              <span className="text-sm font-medium text-espresso-700">Total</span>
              <span className="price-lg text-espresso-800">R$ {total.toFixed(2)}</span>
            </div>
            {dropshipItems.length > 0 && (
              <p className="text-[11px] text-rose-500">
                {dropshipItems.length} {dropshipItems.length === 1 ? "item é" : "itens são"} dropship e {"serão"} enviados pelo fornecedor.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-berry-600 text-white font-bold text-[16px] hover:bg-berry-500 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {loading ? "Processando..." : "Finalizar Pedido"}
          </button>

          <p className="text-center text-[11px] text-espresso-400">
            Seus dados estão protegidos. Pagamento seguro via SSL.
          </p>
        </form>
      </div>
    </div>
  )
}
