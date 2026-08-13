# 🎫 TickEven — Backend (NestJS + Prisma)

API e serviço backend da plataforma **TickEven**, construído com **NestJS**, **TypeScript**, **Prisma ORM** e **PostgreSQL**.

---

## 🛠️ Tecnologias Utilizadas

- **NestJS**: Framework Node.js modular e escalável para o backend.
- **Prisma ORM**: Gerenciamento de banco de dados e migrations com tipagem forte em TypeScript.
- **PostgreSQL**: Banco de dados relacional para persistência de dados.
- **Passport.js & JWT**: Autenticação e autorização baseada em Roles (`ORGANIZER`, `CUSTOMER`, `GATE`).
- **@nestjs/schedule**: Agendamento de Cron Jobs para expiração automática de reservas pendentes.
- **Class Validator & Transformer**: Validação e transformação automática de DTOs nas requisições HTTP.
- **Jest & Supertest**: Suíte de testes unitários e de integração E2E.

---

## 🚀 Instalação e Execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `backend` (ou copie do exemplo):

```env
DATABASE_URL="postgresql://tickeven_user:tickeven_password@localhost:5432/tickeven_db?schema=public"
JWT_SECRET="seu-secret-jwt-super-seguro"
PORT=3000
```

### 3. Migrações do Banco de Dados e Seeds

Execute as migrações para criar as tabelas no PostgreSQL e alimente o banco de dados com dados de demonstração:

```bash
# Criar tabelas no banco de dados
npx prisma migrate dev --name init

# Executar o seed (usuários, eventos e ingressos demo)
npx prisma db seed
```

### 4. Executar a Aplicação

```bash
# Modo de desenvolvimento (hot-reload)
npm run start:dev

# Modo de produção
npm run build
npm run start:prod
```

---

## 🧪 Executando Testes

```bash
# Testes unitários
npm run test

# Testes E2E (Integração de regras de negócio)
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 📄 Licença

Este projeto é um software proprietário desenvolvido para o desafio TickEven.
