# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Em Desenvolvimento
- Endpoints da API para Products, Courses, Orders
- Integração completa com Mercado Pago
- Sistema de carrinho de compras funcional
- Upload de imagens para AWS S3

## [0.1.2] - 2025-01-14

### 🐛 Correções de Deploy - Build em Produção

Esta release corrige **20 erros** de TypeScript e build que impediam o deploy bem-sucedido no Vercel.

#### Corrigido

**1. Configuração NextAuth** (`apps/web/src/app/api/auth/[...nextauth]/route.ts`)
- ❌ Erro: Route handlers não podem exportar `authOptions` no Next.js 14
- ✅ Solução: Removida palavra-chave `export` da constante `authOptions`

**2. Relação Course.category** (múltiplos arquivos)
- ❌ Erro: Modelo Course não tem relação `category` no schema Prisma
- ✅ Solução: Removidas todas as referências a `category` nas queries de Course

**3. Relação Course.instructor.user** (`apps/web/src/app/api/courses/[id]/route.ts`)
- ❌ Erro: `instructor.user` não existe - instructor já é User
- ✅ Solução: Acesso direto aos campos de User com `instructorProfile` nested

**4. Campo CourseSchedule.date** (`apps/web/src/app/api/courses/[id]/route.ts`)
- ❌ Erro: Campo `date` não existe no modelo CourseSchedule
- ✅ Solução: Mudado para `startDate` e `endDate` conforme schema

**5. Unique Constraint CourseEnrollment** (`apps/web/src/app/api/courses/[id]/enroll/route.ts`)
- ❌ Erro: Constraint `courseId_userId` não existe
- ✅ Solução: Mudado `findUnique` para `findFirst` (constraint é `@@unique([userId, courseId, scheduleId])`)

**6. Unique Constraint LessonProgress** (`apps/web/src/app/api/lessons/[id]/progress/route.ts`)
- ❌ Erro: Constraint incorreta para LessonProgress
- ✅ Solução: Usado constraint composta `enrollmentId_lessonId`

**7. Campo Product.imageUrl** (múltiplos arquivos)
- ❌ Erro: Product não tem campo `imageUrl`, usa array `images`
- ✅ Solução: Mudado todas referências de `imageUrl` para `images`

**8. Relação OrderItem.seller** (`apps/web/src/app/api/orders/[id]/route.ts`)
- ❌ Erro: OrderItem não tem relação direta com seller
- ✅ Solução: Acessado seller via `product.seller`

**9. Relação Order.user** (múltiplos arquivos)
- ❌ Erro: Order não tem relação `user`, tem `buyer` e `seller`
- ✅ Solução: Mudado `user` para `buyer` e `userId` para `buyerId`

**10. Aritmética com Prisma Decimal** (`apps/web/src/app/api/seller/analytics/route.ts`, `apps/web/src/app/api/seller/orders/route.ts`)
- ❌ Erro: Tipo Decimal do Prisma não pode ser usado diretamente em operações aritméticas
- ✅ Solução: Convertido para Number: `Number(product.price)`, `Number(item.price)`

**11. Campos Order.shippingAddress/billingAddress** (`apps/web/src/app/api/orders/route.ts`)
- ❌ Erro: Order não tem campos JSON, usa relação Address
- ✅ Solução: Adicionado `addressId`, auto-criação de Address, campos `orderNumber`, `platformFee`, `sellerAmount`

**12. Campos Payment Model** (`apps/web/src/app/api/payments/webhook/route.ts`)
- ❌ Erro: Campos e enums do Payment não correspondem ao schema
- ✅ Solução:
  - `transactionId` → `mercadoPagoId`
  - Adicionado campo `mercadoPagoStatus`
  - Enums corretos: `APPROVED`, `REJECTED`, `REFUNDED`
  - Adicionado `PaymentMethod` enum (`CREDIT_CARD`, `DEBIT_CARD`, `PIX`, `BOLETO`)

**13. Enum OrderStatus** (`apps/web/src/app/api/payments/webhook/route.ts`)
- ❌ Erro: OrderStatus não tem `CONFIRMED`
- ✅ Solução: Mudado `CONFIRMED` para `PAID`

**14. Iteração de Map com TypeScript** (`apps/web/src/app/api/payments/webhook/route.ts`)
- ❌ Erro: Map não pode ser iterado sem `--downlevelIteration`
- ✅ Solução: Usado `Array.from(map.entries())`

**15. Campo Payout.orderId** (`apps/web/src/app/api/payments/webhook/route.ts`)
- ❌ Erro: Payout não tem campo `orderId`
- ✅ Solução: Removida criação de Payout do webhook (modelo é para saques, não ordens)

**16. Relação Product.seller.user** (`apps/web/src/app/api/products/[id]/route.ts`, `apps/web/src/app/api/wishlist/route.ts`)
- ❌ Erro: `seller.user` não existe - seller já é User
- ✅ Solução: Acesso direto aos campos de User com `sellerProfile` nested

**17. Campo ProductVariation.createdAt** (`apps/web/src/app/api/products/[id]/route.ts`)
- ❌ Erro: ProductVariation não tem `createdAt` para orderBy
- ✅ Solução: Removido orderBy, usado `variations: true`

**18. Campo OrderItem.createdAt (filtro)** (`apps/web/src/app/api/seller/analytics/route.ts`)
- ❌ Erro: OrderItem não tem `createdAt`
- ✅ Solução: Filtrado por `order.createdAt`, incluído no select, ajustado lógica de agrupamento

**19. Campo OrderItem.createdAt (ordenação)** (`apps/web/src/app/api/seller/orders/route.ts`)
- ❌ Erro: OrderItem não tem `createdAt` para orderBy
- ✅ Solução: Mudado para `orderBy: { order: { createdAt: 'desc' } }`

**20. Relação Payout.order** (`apps/web/src/app/api/seller/payouts/route.ts`)
- ❌ Erro: Payout não tem relação `order`
- ✅ Solução: Removido include, mudado orderBy para `requestedAt`

**21. Página Offline sem Client Component** (`apps/web/src/app/offline/page.tsx`)
- ❌ Erro: Server Component não pode passar onClick handlers
- ✅ Solução: Adicionada diretiva `'use client'`

#### Modificado

**Arquivos Atualizados (21 correções):**
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- `apps/web/src/app/api/courses/[id]/route.ts`
- `apps/web/src/app/api/courses/[id]/enroll/route.ts`
- `apps/web/src/app/api/lessons/[id]/progress/route.ts`
- `apps/web/src/app/api/orders/route.ts`
- `apps/web/src/app/api/orders/[id]/route.ts`
- `apps/web/src/app/api/payments/webhook/route.ts`
- `apps/web/src/app/api/products/[id]/route.ts`
- `apps/web/src/app/api/products/route.ts`
- `apps/web/src/app/api/seller/analytics/route.ts`
- `apps/web/src/app/api/seller/orders/route.ts`
- `apps/web/src/app/api/seller/payouts/route.ts`
- `apps/web/src/app/api/wishlist/route.ts`
- `apps/web/src/app/offline/page.tsx`

#### Deploy e CI/CD
- ✅ Build TypeScript: Passou sem erros
- ✅ Geração de páginas estáticas: 35/35 completas
- ✅ Deploy no Vercel: Bem-sucedido
- ✅ Status: **LIVE** em produção

#### Padrões Identificados e Corrigidos

1. **Relações Prisma**: Código assumia estrutura de schema diferente do real
2. **Tipos Prisma**: Decimal requer conversão explícita para Number
3. **Next.js 14**: Route handlers têm restrições de export
4. **Client vs Server Components**: Handlers de evento requerem `'use client'`

#### Impacto
- ⚡ **Antes**: Build falhando com 20+ erros de compilação
- ✅ **Depois**: Build passando, deploy bem-sucedido, app em produção

#### Links Relacionados
- [Vercel Deploy](https://institutosb-marketplace-ayk1itkfa.vercel.app)
- [Branch de Deploy](https://github.com/maurillio/institutosb-marketplace/tree/claude/beauty-pro-marketplace-setup-01MTUpYaZQTmpRkLc6v5oEi8)

## [0.1.1] - 2025-01-14

### 🚀 Deploy em Produção

#### Adicionado
- ✅ Deploy completo no Vercel: https://thebeautypro.vercel.app/
- ✅ Banco de dados PostgreSQL no Neon (us-east-1)
- ✅ Variáveis de ambiente de produção configuradas
- ✅ Auto-deploy ativo na branch `claude/beauty-pro-marketplace-setup-01MTUpYaZQTmpRkLc6v5oEi8`

#### Modificado
- 📝 README.md atualizado com URL de produção e status do deploy
- 📝 Documentação com instruções de deploy completas

#### Infraestrutura de Produção
- **Frontend:** Vercel (Edge Network global)
- **Database:** Neon PostgreSQL (0.5GB free tier)
- **Branch de Deploy:** `claude/beauty-pro-marketplace-setup-01MTUpYaZQTmpRkLc6v5oEi8`
- **Custo Mensal:** ~$0 (usando free tiers)

## [0.1.0] - 2025-01-14

### 🎉 Lançamento Inicial - Estrutura Completa

#### Adicionado

**Infraestrutura:**
- ✅ Configuração completa do Turborepo (monorepo)
- ✅ Docker Compose com PostgreSQL, Redis e pgAdmin
- ✅ Estrutura de pastas para apps e packages
- ✅ Configuração de ambiente (.env.example)
- ✅ Git ignore configurado

**Frontend (Next.js 14):**
- ✅ Next.js 14 com App Router
- ✅ TypeScript + Tailwind CSS + Shadcn/UI
- ✅ Layout completo (Header + Footer responsivo)
- ✅ Página inicial com:
  - Hero section
  - Categorias em destaque
  - Produtos em destaque (mockado)
  - Cursos populares (mockado)
- ✅ Provider de autenticação (NextAuth.js estruturado)
- ✅ Design mobile-first

**Backend (NestJS):**
- ✅ Estrutura completa de módulos:
  - Auth (autenticação)
  - Users (usuários)
  - Products (produtos)
  - Courses (cursos)
  - Orders (pedidos)
  - Payments (pagamentos)
  - Categories (categorias)
- ✅ Integração com Prisma
- ✅ Swagger/OpenAPI configurado
- ✅ Database service global
- ✅ Health check endpoint

**Database (Prisma + PostgreSQL):**
- ✅ Schema completo com todas as models:
  - Users & Authentication (NextAuth compatible)
  - Seller & Instructor profiles com planos de assinatura
  - Products com suporte a novos/usados e variações
  - Courses (online/presencial) com módulos, aulas e agendas
  - Orders & Payments com split do Mercado Pago
  - Reviews & Ratings
  - Notifications
  - Payouts
- ✅ Seed com dados de exemplo (admin, vendedor, instrutor, produtos, curso)

**Packages:**
- ✅ `@thebeautypro/database` - Prisma schema e client compartilhado
- ✅ `@thebeautypro/ui` - Componentes UI base (Button, utils)
- ✅ `@thebeautypro/types` - TypeScript types compartilhados

**Documentação:**
- ✅ README.md principal com visão geral completa
- ✅ docs/SETUP.md - Guia detalhado de configuração do ambiente
- ✅ docs/STRUCTURE.md - Arquitetura e organização do código
- ✅ docs/CHECKLIST.md - Status de ~250+ funcionalidades mapeadas
- ✅ docs/DEPLOY.md - Guia completo de deploy em produção
- ✅ docs/README.md - Índice da documentação
- ✅ CHANGELOG.md - Este arquivo

**Scripts NPM:**
- ✅ `npm run dev` - Desenvolvimento de todos os apps
- ✅ `npm run build` - Build de produção
- ✅ `npm run lint` - Linting
- ✅ `npm run format` - Formatação com Prettier
- ✅ `npm run clean` - Limpeza de builds

#### Estrutura do Projeto

```
the-beauty-pro/
├── apps/
│   ├── web/              # Next.js 14 Frontend
│   └── api/              # NestJS Backend
├── packages/
│   ├── database/         # Prisma + PostgreSQL
│   ├── ui/               # Componentes compartilhados
│   └── types/            # TypeScript types
├── docs/                 # Documentação completa
├── docker-compose.yml    # Setup local
├── turbo.json           # Config Turborepo
├── CHANGELOG.md         # Este arquivo
└── README.md            # Overview

Total: ~50 arquivos criados
```

#### Próximos Passos Planejados

Ver [docs/CHECKLIST.md](./docs/CHECKLIST.md) para a lista completa. Prioridades:

1. Implementar autenticação completa (NextAuth.js + JWT)
2. Criar endpoints da API para Products e Courses
3. Conectar frontend com backend
4. Implementar carrinho de compras
5. Integração com Mercado Pago
6. Deploy inicial (MVP)

#### Notas Técnicas

**Status Atual:**
- ✅ Estrutura: 100% completa
- 🔄 Funcionalidades: ~12% implementadas (estrutura criada)
- ⏳ Restante: ~88% para desenvolvimento

**Stack de Produção:**
- Frontend: Vercel
- Database: Neon (PostgreSQL)
- Backend: Railway ou Vercel Serverless
- Storage: AWS S3
- Pagamentos: Mercado Pago

**Custo Estimado (MVP):**
- ~$0-5/mês usando free tiers

---

## Formato do Changelog

Este changelog segue os seguintes tipos de mudanças:

- **Adicionado** - Para novas funcionalidades
- **Modificado** - Para mudanças em funcionalidades existentes
- **Descontinuado** - Para funcionalidades que serão removidas
- **Removido** - Para funcionalidades removidas
- **Corrigido** - Para correções de bugs
- **Segurança** - Para correções de vulnerabilidades

---

**Links:**
- [Repositório](https://github.com/maurillio/institutosb-marketplace)
- [Documentação](./docs/README.md)
- [Checklist de Features](./docs/CHECKLIST.md)
