import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"
import { FAQJsonLd } from "@/components/store/JsonLd"
import { store } from "@/lib/config"

const FAQS = [
  {
    question: "Qual o prazo de entrega?",
    answer: `O prazo varia de acordo com sua região: Sudeste e Sul em até 3-4 dias úteis, Centro-Oeste 5 dias, Nordeste 7 dias e Norte 10 dias. Enviamos para todo Brasil com código de rastreamento. Frete grátis para compras acima de R$ 250.`,
  },
  {
    question: "Como faço para trocar ou devolver um produto?",
    answer: `Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução. O produto deve estar em perfeito estado, sem uso, com etiqueta e na embalagem original. Fale com a Lumi (nossa assistente virtual) para iniciar o processo.`,
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: `Aceitamos cartões de crédito (Visa, Mastercard, Elo) em até 3x sem juros, PIX com aprovação instantânea e boleto bancário. Todo pagamento é processado com segurança pelo Mercado Pago.`,
  },
  {
    question: "Como sei qual é meu tamanho?",
    answer: `Disponibilizamos um Guia de Medidas completo com tabela de tamanhos (PP ao 5G) e instruções de como tirar suas medidas. Acesse a página Guia de Medidas no menu Ajuda ou fale com a Lumi para assistência personalizada.`,
  },
  {
    question: "Vocês têm loja física?",
    answer: `Atualmente operamos 100% online, o que nos permite oferecer preços melhores e uma curadoria especial. Nossa base fica em ${store.city} e enviamos para todo Brasil.`,
  },
  {
    question: "Meus dados estão seguros?",
    answer: `Sim. Utilizamos criptografia SSL em todo o site. Seus dados de pagamento são processados pelo Mercado Pago — nunca armazenamos dados de cartão. Consulte nossa Política de Privacidade para mais detalhes sobre a LGPD.`,
  },
]

export const metadata: Metadata = {
  title: "FAQ — Perguntas Frequentes",
  description: `Tire suas dúvidas sobre entregas, trocas, pagamentos e tamanhos na ${store.name}. Atendimento humanizado com a Lumi.`,
  openGraph: {
    title: `FAQ — ${store.name}`,
    description: `Perguntas frequentes sobre a ${store.name}. Entrega, trocas, pagamentos e mais.`,
    type: "website",
  },
}

export default function FAQPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <FAQJsonLd faqs={FAQS} />
      <div className="container-narrow py-8">
        <Breadcrumbs items={[{ label: "FAQ" }]} />
        <h1 className="display-lg mb-2">Perguntas Frequentes</h1>
        <p className="body-base text-espresso-400 mb-8">
          Tudo o que você precisa saber sobre a {store.name}
        </p>

        <div className="max-w-2xl space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl border border-cream-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-cream-50 transition-colors list-none">
                <span className="text-[15px] font-medium text-espresso-700 pr-4">
                  {faq.question}
                </span>
                <span className="text-gold-400 text-lg flex-shrink-0 group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-[15px] text-espresso-500 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
