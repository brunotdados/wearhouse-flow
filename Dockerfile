# Etapa 1: Build da aplicação
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Servir com nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
