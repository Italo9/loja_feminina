export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectWhatsApp } = await import("@/lib/whatsapp")
    await connectWhatsApp()
  }
}
