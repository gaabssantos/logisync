# Aplicação web do LogiSync (React + Vite), servida pelo Nginx
# Contexto de build: pasta Projeto (necessário por causa da dependência "logisync": "file:..")

# ---------- Etapa 1: build do front-end ----------
FROM node:22-alpine AS build
WORKDIR /app
# certificados extras opcionais (ver certs/README.md)
COPY certs/ /certs/
RUN cat /certs/*.crt > /certs/extra.pem 2>/dev/null || true
ENV NODE_EXTRA_CA_CERTS=/certs/extra.pem
COPY package.json ./
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

# ---------- Etapa 2: servidor web ----------
FROM nginx:1.27-alpine
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
