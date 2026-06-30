# Lumière — Loja Virtual

Loja virtual feminina white-label. A mesma base de código serve múltiplas lojas via variáveis de ambiente.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** (SQLite dev / PostgreSQL produção)
- **Auth.js v5** (NextAuth)
- **Stripe** (pagamentos)
- **Baileys** (WhatsApp in-process)
- **Zustand** (carrinho)

## Rodar local

```bash
npm install
cp .env.example .env
# Ajuste as variáveis no .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Abre http://localhost:3000

## Admin

- `/admin` — painel administrativo
- `/admin/produtos` — gerenciar produtos
- `/admin/pedidos` — gerenciar pedidos
- `/admin/whatsapp` — conectar WhatsApp
- `/admin/config` — configurações da loja

Usuário padrão (seed):
- Email: `admin@lumiere.com.br`
- Senha: `admin123`

## WhatsApp (atendimento humano)

1. No `.env`: `WHATSAPP_ENABLED=true`
2. Acesse `/admin/whatsapp`
3. Escaneie o QR code com o WhatsApp do atendente
4. O chat widget no site terá a opção "Falar com humano"

## Deploy (Google Cloud Run)

```bash
gcloud builds submit --config cloudbuild.yaml
```

O projeto usa `output: "standalone"` e `cloudbuild.yaml` já configurado.

### Variáveis de ambiente no Cloud Run

```
DATABASE_URL=postgres://...   # PostgreSQL (Cloud SQL)
AUTH_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NVIDIA_API_KEY=nvapi-...
WHATSAPP_ENABLED=true
WHATSAPP_ATTENDANT_NUMBER=...
WHATSAPP_AUTH_DIR=./.whatsapp-auth
```

O volume `.whatsapp-auth` precisa ser persistente (Cloud Run não mantém arquivos entre deploys — use um volume Cloud Storage ou mantenha o QR escaneado).
