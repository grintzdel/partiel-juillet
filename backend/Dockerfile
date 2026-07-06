# Backend — Express + Mongoose exécuté directement via tsx (pas d'étape de build).
# Contexte de build attendu : la RACINE du monorepo (voir docker-compose.yml -> context: ..).
FROM node:22-slim AS runtime

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Outils de compilation pour la dépendance native bcrypt (fallback si pas de binaire pré-compilé).
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable
WORKDIR /app

# --- Dépendances (couche cachée tant que les manifests ne changent pas) ---
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN pnpm install --frozen-lockfile --filter backend

# --- Code source backend ---
COPY backend backend

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]
