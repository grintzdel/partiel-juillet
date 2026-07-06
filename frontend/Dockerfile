# Frontend — build Vite puis servi en statique par nginx.
# Contexte de build attendu : la RACINE du monorepo (voir docker-compose.yml -> context: ..).

# --- Étape 1 : build ---
FROM node:22-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Dépendances (couche cachée tant que les manifests ne changent pas).
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN pnpm install --frozen-lockfile --filter frontend

# Code source frontend.
COPY frontend frontend

# VITE_API_URL est figé au BUILD : Vite inline les variables VITE_* dans le bundle.
# -> doit pointer vers l'URL PUBLIQUE du backend (ex: https://api.eventhub.mondomaine.fr/api).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app/frontend
RUN pnpm build

# --- Étape 2 : runtime Caddy (sert le statique) ---
FROM caddy:2-alpine AS runtime
COPY frontend/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/frontend/dist /srv
EXPOSE 80
