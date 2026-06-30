export async function register() {
  // WhatsApp agora roda no relay (servidor standalone no Railway/Docker).
  // O Next.js (Vercel/serverless) apenas faz proxy via src/lib/relay.ts.
  // Nenhuma conexão Baileys é iniciada aqui.
}
