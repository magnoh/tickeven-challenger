# Uso de Inteligência Artificial — TickEven

## Visão Geral
Este documento descreve de forma transparente o papel das ferramentas de Inteligência Artificial no processo de concepção, planejamento, estruturação e desenvolvimento da plataforma **TickEven**.

## Ferramentas Utilizadas
- **Antigravity AI (Google DeepMind)** com modelo Claude 3.5 Sonnet / Gemini Flash.
- **VSCode + Antigravity Extension** para geração autônoma de artefatos de planejamento e refatoração de código.

## Áreas de Atuação da IA
1. **Planejamento Multi-Agente**:
   - Definição da divisão do trabalho entre 4 agentes virtuais especializados (AGENT-BE, AGENT-FE, AGENT-INFRA, AGENT-TEST).
   - Mapeamento das 12 fases do projeto e dependências entre elas.

2. **Modelagem de Dados e Schemas**:
   - Geração das entidades Prisma e enums conforme os requisitos do desafio.
   - Criação dos scripts de seed com dados realistas.

3. **Arquitetura de Concorrência e Segurança**:
   - Implementação da lógica de atualização atômica no NestJS para prevenir overselling (`availableTickets >= quantity`).
   - Implementação da estratégia de tokens seguros com HMAC-SHA256 para QR Codes.

4. **Interface e UX**:
   - Construção do Design System em Vanilla CSS + Tailwind.
   - Criação da interface reativa em React com TanStack Query e componentes intuitivos de checkout e portaria.

## Decisões Humanas e Validações Finais
- Escolha da estratégia de execução de containers Docker no ambiente WSL (Ubuntu).
- Aprovação e revisão do plano de implementação inicial.
- Definição dos perfis de usuário de teste (`organizador@demo.com`, `cliente1@demo.com`, `portaria@demo.com`).
- Escolha pelo mock inteligente da API Ticketmaster diante da ausência de uma chave de API pública de terceiros.
