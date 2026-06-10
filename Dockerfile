FROM node:20-slim AS base

WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps

COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m appuser && chown -R appuser:appuser /app 
USER appuser 

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=appuser:appuser . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -fsS http://localhost:3000/health || exit 1

CMD ["node", "server.js"]