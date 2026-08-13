# Decisões de Arquitetura (ADRs) — TickEven

## ADR-001: Integração e Abstração do Catálogo Ticketmaster
- **Status**: Aceito
- **Contexto**: O desafio exige integração com uma API de eventos externa. A Ticketmaster Discovery API foi escolhida por ser a fonte dominante de eventos globais.
- **Decisão**: A API externa funciona estritamente como um catálogo de importação (fonte de consulta). Para suportar ambientes de dev sem chave ativa, o serviço implementa um Mock de alto nível que retorna a mesma estrutura oficial da API REST da Ticketmaster.

## ADR-002: Persistência Local dos Eventos Comercializados
- **Status**: Aceito
- **Contexto**: Depender de uma API de terceiros durante o fluxo transacional de compra introduz latência e riscos de disponibilidade.
- **Decisão**: Quando o organizador seleciona um evento externo, seus dados são salvos no banco local PostgreSQL com status `DRAFT`. Todas as transações de reserva e pagamento operam exclusivamente sobre o banco local.

## ADR-003: Modelo Pista / Quantidade
- **Status**: Aceito
- **Contexto**: Reduzir a complexidade desnecessária de mapa de assentos para priorizar um fluxo completo de ponta a ponta sem bugs.
- **Decisão**: Ingressos são comercializados em modelo de Pista por quantidade simples (`[- 2 +]`).

## ADR-004: Controle de Concorrência e Prevenção de Overselling
- **Status**: Aceito
- **Contexto**: Múltiplos usuários tentando comprar os últimos ingressos simultaneamente podem causar race conditions e venda duplicada (overselling).
- **Decisão**: A redução do estoque é feita via transação atômica do Prisma (`$transaction`) usando cláusula de atualização condicional `updateMany` com guarda `availableTickets >= quantity`. Se a contagem de registros afetados for 0, a transação reverte com erro 409 Conflict.

## ADR-005: Tokens de Ingresso Criptograficamente Seguros e QR Code
- **Status**: Aceito
- **Contexto**: Ingressos expostos apenas via ID numérico ou incremental são facilmente adivinháveis ou adulteráveis por fraudadores.
- **Decisão**: Cada ingresso gerado após pagamento recebe um token `codeHash` único baseado em HMAC-SHA256 gerado no servidor. O QR Code é gerado no cliente (React) encapsulando o link seguro de validação.

## ADR-006: Pagamento Simulado com Idempotência
- **Status**: Aceito
- **Contexto**: O objetivo do desafio é demonstrar a arquitetura e controle de estado sem exigir credenciais financeiras de gateway real.
- **Decisão**: Criado um endpoint `/payments` que aceita respostas simuladas (`APPROVED` ou `DECLINED`). A operação é totalmente idempotente — reservas já pagas recusam novas tentativas.

## ADR-007: Arquitetura Modular no NestJS
- **Status**: Aceito
- **Contexto**: Manter a separação clara de responsabilidades por módulos de domínio.
- **Decisão**: O backend segue a estrutura `modules/{auth, users, events, reservations, payments, tickets, gate, external}` com controllers finos, DTOs validados via `class-validator` e serviços dedicados.
