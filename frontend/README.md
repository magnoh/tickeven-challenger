# 🎫 TickEven — Frontend (React + Vite + Tailwind CSS)

Interface web interativa da plataforma **TickEven**, construída com **React**, **TypeScript**, **Vite** e **Tailwind CSS**.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**: Biblioteca de interface de usuário declarativa e reativa.
- **Vite**: Ferramenta de build rápida e servidor de desenvolvimento com HMR instantâneo.
- **Tailwind CSS**: Framework CSS para estilização moderna e responsiva (Tema Dark).
- **TanStack Query (React Query)**: Gerenciamento de estado assíncrono e cache de dados do servidor.
- **React Router DOM**: Roteamento dinâmico de páginas da aplicação.
- **Lucide React**: Biblioteca de ícones modernos.
- **qrcode.react & html5-qrcode**: Geração de QR Code para ingressos e scanner via câmera do dispositivo para portaria.

---

## 🚀 Instalação e Execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)

Por padrão, o frontend se conecta ao backend na porta `http://localhost:3000/api`. Caso queira alterar, configure um arquivo `.env` na raiz da pasta `frontend`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse o aplicativo em seu navegador no endereço: `http://localhost:5173`.

### 4. Gerar Build de Produção

```bash
npm run build
```

---

## 📄 Licença

Este projeto é um software proprietário desenvolvido para o desafio TickEven.
