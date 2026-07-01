# Stage 1: builder
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Layer 1: dependencies — cached unless package*.json changes
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --loglevel=error

# Layer 2: prisma — cached unless schema.prisma changes
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate --no-hints

# Layer 3: source + build — only rebuilds when source changes
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat openssl

# Prisma CLI — cached unless base image updates
RUN npm install prisma@5.22.0 --no-audit --no-fund --loglevel=error

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

CMD sh -c "npx prisma db push --skip-generate --accept-data-loss && node server.js"
