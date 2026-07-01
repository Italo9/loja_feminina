import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { pid, orderNumber, trackingNumber, status } = body

    if (!pid) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // Atualiza o DropshipOrder com tracking
    if (trackingNumber && orderNumber) {
      await prisma.dropshipOrder.updateMany({
        where: { externalId: orderNumber },
        data: {
          trackingCode: trackingNumber,
          status: status === "shipped" ? "shipped" : "processing",
        },
      })

      // Atualiza tracking no pedido principal
      const ds = await prisma.dropshipOrder.findFirst({
        where: { externalId: orderNumber },
      })
      if (ds) {
        await prisma.order.update({
          where: { id: ds.orderId },
          data: { trackingCode: trackingNumber },
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[CJ Webhook] Erro:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
