# 🎫 TickEven — Plataforma de Eventos e Ingressos

Plataforma completa de eventos e ingressos construída para o **Desafio Elite Dev da Verzel**. O sistema permite a gestão de eventos por organizadores, navegação e reserva atômica com pagamento simulado por clientes, e validação em tempo real de ingressos via câmera/QR Code pela equipe de portaria.

---

## 🌟 Recursos Principais

- **Autenticação & Autorização por Roles**: Perfis distintos para `ORGANIZER`, `CUSTOMER` e `GATE` protegidos via JWT e Guards no NestJS.
- **Prevenção de Overselling**: Atualizações de estoque em transações atômicas do PostgreSQL (`availableTickets >= quantity`).
- **Expiração de Reserva**: Cron Job automático (`@nestjs/schedule`) expira reservas pendentes após 10 minutos e devolve o estoque.
- **Ingressos Criptográficos**: Tokens seguros via HMAC-SHA256 e visualização de QR Code reativo no cliente.
- **Portaria com Leitura de QR Code**: Validação na câmera do dispositivo ou digitação manual com respostas visuais instantâneas (`VALID`, `ALREADY_USED`, `INVALID`, `CANCELLED`).
- **Catálogo Externo The Movie DB (TMDB)**: Importação de dados de filmes e posters em alta resolução para criação rápida de eventos e sessões pelo organizador.
- **Modelagem de Arenas e Salas**: 3 layouts interativos (Anfiteatro Orion com setores em arco, Arena/Estádio esportivo e Teatro clássico com plateia/frisas/balcão).

---

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** & **TypeScript** (Strict Mode)
- **NestJS** (Framework backend modular)
- **Prisma ORM** & **PostgreSQL**
- **Passport.js & JWT** (Autenticação)
- **@nestjs/schedule** (Expiração automática de reservas)
- **Jest & Supertest** (Testes de integração)

### Frontend
- **React** & **TypeScript**
- **Vite** (Build tool e Dev server)
- **Tailwind CSS** (Design System Dark Mode moderno)
- **TanStack Query** (Gerenciamento de estado de servidor)
- **qrcode.react** & **html5-qrcode** (Geração e scanner de QR Code)
- **Lucide React** (Ícones modernos)

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js v18+ instalado.
- Docker e Docker Compose (ou WSL Ubuntu com Docker ativo).

### 2. Iniciar o Banco de Dados (PostgreSQL)
No seu terminal (ou WSL):
```bash
docker compose up -d
```

### 3. Configurar e Iniciar o Backend
```bash
cd backend
cp ../.env.example .env

# Instalar dependências
npm install

# Executar migrations e alimentar o banco com os dados demo
npx prisma migrate dev --name init
npx prisma db seed

# Iniciar backend em modo desenvolvimento (Porta 3000)
npm run start:dev
```

### 4. Configurar e Iniciar o Frontend
Em outro terminal:
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Porta 5173)
npm run dev
```

Acesse o aplicativo em seu navegador em `http://localhost:5173`.

---

## 🔐 Usuários e Credenciais para Testes (Seed)

Todas as contas de teste utilizam a senha padrão: **`123456`**

| Perfil | E-mail | Funcionalidades |
| text | text | text |
| **ORGANIZER** | `organizador@demo.com` | Criar eventos, publicar rascunhos, importar dados TMDB, escolher layouts de arena, acompanhar vendas |
| **CUSTOMER 1** | `cliente1@demo.com` | Navegar, reservar ingressos, simular pagamentos |
| **CUSTOMER 2** | `cliente2@demo.com` | Possui ingresso ativo (`demo-ticket-active-hash-12345`) e já utilizado para testes |
| **GATE** | `portaria@demo.com` | Acessar scanner da câmera e validar ingressos na portaria |

---

## 🧪 Testes de Integração

Para executar a suíte de testes automatizados do backend:
```bash
cd backend
npm run test:e2e
```

---

## 🚀 Preparado para Deploy

### Frontend (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` (URL do seu backend no Render/Railway)

### Backend (Render / Railway / Fly.io)
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && npm run start:prod`
- **Environment Variables**:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `FRONTEND_URL`

---

## 📄 Documentação Adicional
- **[Decisões de Arquitetura (ADRs)](file:///c:/Users/Magno/Documents/Estudo/tickeven-challenger/tickeven/docs/DECISIONS.md)**
- **[Relatório de Uso de Inteligência Artificial](file:///c:/Users/Magno/Documents/Estudo/tickeven-challenger/tickeven/docs/AI.md)**
