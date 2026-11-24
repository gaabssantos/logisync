# API REST do LogiSync (Node.js + Express + TypeScript)
# Contexto de build: pasta Projeto (necessário por causa da dependência "logisync": "file:..")

# ---------- Etapa 1: dependências e compilação ----------
FROM node:22-alpine AS build
WORKDIR /app
# certificados extras opcionais (ver certs/README.md)
COPY certs/ /certs/
RUN cat /certs/*.crt > /certs/extra.pem 2>/dev/null || true
ENV NODE_EXTRA_CA_CERTS=/certs/extra.pem
COPY package.json ./
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci
COPY server/tsconfig.json ./server/
COPY server/src ./server/src
RUN cd server && npm run build && npm prune --omit=dev

# ---------- Etapa 2: execução ----------
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY --from=build /app/server/package.json ./server/
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/dist ./server/dist
WORKDIR /app/server
USER node
EXPOSE 3001
CMD ["node", "dist/index.js"]
