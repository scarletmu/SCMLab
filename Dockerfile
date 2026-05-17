# syntax=docker/dockerfile:1.7
# Multi-stage build: deps → builder → runner
# Produces a slim runtime image using Next.js standalone output.

# ───────────────────────────────────────────────────────────────
# Stage 1: dependencies
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ───────────────────────────────────────────────────────────────
# Stage 2: build
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time secrets (optional — page falls back when unset)
ARG GITHUB_TOKEN
ARG GITHUB_LOGIN
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV GITHUB_LOGIN=$GITHUB_LOGIN
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ───────────────────────────────────────────────────────────────
# Stage 3: runtime
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root runtime user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# next.config.ts has `output: "standalone"` — the standalone dir already
# contains a minimal node_modules tree, so we do NOT copy /app/node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Content YAMLs are loaded at request/build time
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
