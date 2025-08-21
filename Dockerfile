# Etapa 1: Build da aplicação com Node
FROM node:18 AS builder

WORKDIR /app
COPY . .

# Instala dependências e builda a aplicação
RUN npm install
RUN npm run build

# Etapa 2: Servidor estático com NGINX
FROM nginx:alpine

# Remove a config padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados da primeira imagem para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração personalizada se quiser
# COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta padrão
EXPOSE 80

# Comando padrão do nginx
CMD ["nginx", "-g", "daemon off;"]
