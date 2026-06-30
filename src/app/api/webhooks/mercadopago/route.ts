import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const STATUS_MAP: Record<string, string> = {
  approved: "paid",
  authorized: "pending",
  in_process: "pending",
  in_mediation: "pending",
  pending: "pending",
  rejected: "failed",
  cancelled: "cancelled",
  refunded: "refunded",
  charged_back: "refunded",
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const paymentId = body.data?.id ?? body.id
    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "no payment id" }, { status: 400 })
    }

    // Obter detalhes do pagamento via API do Mercado Pago
    const mpToken = process.env.MP_ACCESS_TOKEN
    if (!mpToken) {
      return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 })
    }

    const paymentRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${mpToken}` } }
    )

    if (!paymentRes.ok) {
      return NextResponse.json({ ok: false, error: "failed to fetch payment" }, { status: 500 })
    }

    const payment = await paymentRes.json()
    const orderId = payment.external_reference
    const mpStatus = payment.status ?? "pending"

    if (!orderId) {
      return NextResponse.json({ ok: true, skipped: "no external_reference" })
    }

    const newPaymentStatus = STATUS_MAP[mpStatus] ?? "pending"

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: newPaymentStatus },
    })

    // Se pagamento aprovado, atualizar status do pedido para confirmed
    if (newPaymentStatus === "paid") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "confirmed" },
      })
    }

    console.log(`[MP Webhook] Pedido ${orderId}: ${mpStatus} → ${newPaymentStatus}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[MP Webhook] Erro:", error)
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 })
  }
}
