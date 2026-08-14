# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências para o build
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copiar todo o código-fonte
COPY . .

# Gerar Prisma Client e fazer o build da aplicação NestJS
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar package.json e dependências de produção
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

# Copiar o build compilado e os artefatos do Prisma da etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

# Executar migrações do Prisma e iniciar a aplicação NestJS em produção
CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]
