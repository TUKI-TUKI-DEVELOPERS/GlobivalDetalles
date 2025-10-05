# Etapa 1: Build
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Solo usamos vite build (evitamos errores TS de tsc)
RUN npm run build

# Etapa 2: Servir el frontend
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]