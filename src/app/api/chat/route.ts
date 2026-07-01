import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { store, assistant } from "@/lib/config"

async function buildSiteContext(): Promise<string> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      select: { name: true, price: true, category: { select: { name: true } } },
      take: 50,
    }),
    prisma.category.findMany({ select: { name: true } }),
  ])

  const catNames = categories.map((c) => c.name).join(", ")
  const productList = products
    .map((p) => `  ${p.name} (${p.category?.name ?? "Sem categoria"}) R$${p.price.toFixed(2)}`)
    .join("\n")

  return `Você é ${assistant.name}, ${assistant.role} da ${store.name}, loja de moda feminina premium.

Informações da loja:
Cidade: ${store.city}
Instagram: @${store.instagram}
Email: ${store.email}
Telefone: ${store.phone}
Frete: ${store.shippingInfo} (grátis acima de R$250)

Políticas:
Troca em até 7 dias. Produto deve estar sem uso com etiqueta.
Pagamento via Mercado Pago: Pix, cartão em até 3x, boleto.
Privacidade: LGPD. Dados protegidos com SSL.

Categorias disponíveis: ${catNames}

Produtos em destaque:
${productList}

Regras:
1. Responda APENAS sobre a loja, produtos, moda feminina e atendimento.
2. Se perguntarem algo fora do escopo, diga educadamente que só pode ajudar com assuntos da loja.
3. Seja sempre educada, feminina, elegante e use emojis com moderação.
4. Nomes de produtos DEVEM estar em português.
5. Recomende peças do catálogo quando relevante.
6. NUNCA invente produtos que não estão na lista acima.
7. Mantenha respostas curtas e diretas (máximo 4 frases).
8. NUNCA use travessão em hipótese alguma.`
}

export async function POST(req: Request) {
  const { text } = await req.json()
  if (!text?.trim()) {
    return NextResponse.json({ reply: "Como posso ajudar?" })
  }

  const context = await buildSiteContext()
  const apiKey = process.env.NVIDIA_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      reply: `Oi! Eu sou a ${assistant.name}, ${assistant.role} da ${store.name}. Como posso te ajudar hoje? ✨`,
    })
  }

  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: context },
          { role: "user", content: text },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    })

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não entendi. Pode reformular?"

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({
      reply: `Oi! Sou a ${assistant.name}. No momento estou com dificuldade, mas você pode ver nosso catálogo em /catalogo ✨`,
    })
  }
}
