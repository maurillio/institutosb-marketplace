# Notas de Sessão - The Beauty Pro

Este documento mantém o contexto atualizado do projeto para facilitar continuidade em futuras sessões de desenvolvimento.

## 📊 Status Atual (v0.1.2 - 14 Jan 2025)

### ✅ Completamente Funcional

1. **Deploy em Produção**
   - URL: https://institutosb-mark-git-132e18-maurillio-araujo-oliveiras-projects.vercel.app
   - Status: ✅ LIVE
   - Branch: `claude/beauty-pro-marketplace-setup-01MTUpYaZQTmpRkLc6v5oEi8`
   - CI/CD: Deploy automático ativo
   - Tipo: Preview Deployment (branch-specific)

2. **Infraestrutura**
   - Frontend: Vercel (Edge Network)
   - Database: Neon PostgreSQL (us-east-1)
   - Build: Passando (35/35 páginas estáticas geradas)
   - Backups: Automáticos (Neon)

3. **Autenticação**
   - NextAuth.js: Configurado e funcional
   - Sessões: Funcionando
   - Providers: Credentials (email/senha)

4. **Database**
   - Schema Prisma: 100% completo
   - Models: 20+ tabelas criadas
   - Migrations: Aplicadas em produção
   - Seed: Dados de exemplo disponíveis

### 🔄 Em Desenvolvimento

1. **Endpoints API** (estrutura criada, precisa implementação completa)
   - `/api/products` - Listagem e detalhes
   - `/api/courses` - Cursos
   - `/api/orders` - Pedidos
   - `/api/payments` - Pagamentos (Mercado Pago)

2. **Frontend Pages** (mockado, precisa conexão com dados reais)
   - Home page (produtos e cursos mockados)
   - Listagem de produtos
   - Detalhes de produto
   - Listagem de cursos

### ⏳ Próximas Prioridades

1. Implementar UI completa de Login e Cadastro
2. Conectar listagem de produtos com dados reais da API
3. Sistema de carrinho de compras
4. Integração completa com Mercado Pago
5. Upload de imagens (AWS S3)

---

## 🐛 Correções da Sessão Anterior (v0.1.2)

### Contexto
Durante o deploy inicial no Vercel, 21 erros de TypeScript foram identificados. Todos foram sistematicamente corrigidos.

### Padrões de Erro Identificados

1. **Relações Prisma Incorretas**
   - Problema: Código assumia estrutura diferente do schema real
   - Exemplos: `instructor.user`, `seller.user`, `order.user`
   - Solução: Alinhado com schema - relações diretas

2. **Campos Inexistentes**
   - `imageUrl` → `images` (array)
   - `date` → `startDate/endDate`
   - `transactionId` → `mercadoPagoId`

3. **Tipos Prisma**
   - Decimal não pode ser usado em aritmética direta
   - Solução: `Number(value)` antes de operações

4. **Next.js 14 App Router**
   - Route handlers não podem exportar constantes
   - Server Components não podem passar onClick handlers
   - Solução: Remover exports desnecessários, adicionar `'use client'`

### Arquivos Corrigidos (14 files)
```
apps/web/src/app/api/
├── auth/[...nextauth]/route.ts
├── courses/[id]/route.ts
├── courses/[id]/enroll/route.ts
├── lessons/[id]/progress/route.ts
├── orders/route.ts
├── orders/[id]/route.ts
├── payments/webhook/route.ts
├── products/[id]/route.ts
├── products/route.ts
├── seller/analytics/route.ts
├── seller/orders/route.ts
├── seller/payouts/route.ts
└── wishlist/route.ts

apps/web/src/app/offline/page.tsx
```

### Lições Aprendidas

1. **Sempre verificar o schema Prisma** antes de assumir estrutura de relações
2. **Tipos Prisma têm comportamentos específicos** (Decimal, Enum, etc.)
3. **Next.js 14 tem regras estritas** para Route Handlers e Components
4. **Testar build localmente** antes de push para produção

---

## 🏗️ Arquitetura e Decisões Técnicas

### Monorepo Structure (Turborepo)
```
/
├── apps/
│   ├── web/       # Next.js 14 Frontend
│   └── api/       # NestJS Backend (futuro)
├── packages/
│   ├── database/  # Prisma Schema compartilhado
│   ├── ui/        # Componentes compartilhados
│   └── types/     # TypeScript types
```

### Stack Tecnológica
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind + Shadcn/UI
- **Backend:** NestJS (estrutura criada)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js
- **Deploy:** Vercel (Frontend) + Neon (DB)

### Decisões Importantes

1. **Prisma como Single Source of Truth**
   - Todo código deve seguir exatamente o schema Prisma
   - Não assumir estruturas - sempre verificar

2. **Next.js API Routes como Backend Inicial**
   - Backend NestJS separado virá na Fase 2
   - Por enquanto, API routes do Next.js servem como backend

3. **Multi-tenant User Model**
   - Mesma conta pode ser comprador, vendedor e instrutor
   - Perfis separados (SellerProfile, InstructorProfile)
   - Planos de assinatura por perfil

4. **Split Payment com Mercado Pago**
   - Plataforma cobra comissão (10% padrão)
   - Cálculo: `platformFee`, `sellerAmount`
   - Webhook para atualização de status

---

## 📝 Schema Prisma - Referência Rápida

### Principais Models

**User** (autenticação + perfil base)
- Campos: id, name, email, password, roles[]
- Relações: sellerProfile, instructorProfile, addresses, orders

**Product**
- seller → User (não SellerProfile!)
- images → String[] (não imageUrl!)
- variations → ProductVariation[]

**Course**
- instructor → User (direto, não instructor.user!)
- tipo: ONLINE | PRESENCIAL
- modules → CourseModule[]
- schedules → CourseSchedule[]

**Order**
- buyer → User (não user!)
- seller → User
- address → Address (não JSON shippingAddress!)
- Campos: orderNumber, platformFee, sellerAmount

**Payment**
- mercadoPagoId (não transactionId!)
- method: CREDIT_CARD | DEBIT_CARD | PIX | BOLETO
- status: PENDING | APPROVED | REJECTED | REFUNDED

**OrderItem**
- NÃO tem: seller, createdAt, total
- TEM: price, quantity

**Payout** (saques do vendedor)
- NÃO tem relação com Order
- É para withdrawal requests
- orderBy: requestedAt

### Enums Importantes
```prisma
enum Role {
  BUYER
  SELLER
  INSTRUCTOR
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID          // não CONFIRMED!
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  APPROVED      // não COMPLETED!
  REJECTED      // não FAILED!
  REFUNDED
}
```

---

## 🔐 Variáveis de Ambiente

### Produção (Vercel)
```env
DATABASE_URL=postgresql://... (Neon)
NEXTAUTH_URL=https://institutosb-marketplace-ayk1itkfa.vercel.app
NEXTAUTH_SECRET=dUzByhGAD8xjylzJ9MqxM4ZHvbFM713KYUOb0BAYZgY=
NEXT_PUBLIC_API_URL=https://institutosb-marketplace-ayk1itkfa.vercel.app/api

# Ainda não configurados
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_PUBLIC_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
```

### Desenvolvimento Local
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/thebeautypro
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=(mesmo de produção)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🚀 Comandos Úteis

### Desenvolvimento Local
```bash
# Iniciar tudo
npm run dev

# Apenas frontend
npm run dev --filter=@thebeautypro/web

# Database
cd packages/database
npx prisma studio           # UI visual do DB
npx prisma migrate dev      # Criar migration
npx prisma generate         # Gerar client
npm run db:seed             # Popular dados
```

### Deploy
```bash
# Build local (testar antes de push)
npm run build

# Deploy no Vercel (automático via push)
git push origin claude/beauty-pro-marketplace-setup-01MTUpYaZQTmpRkLc6v5oEi8

# Aplicar migrations em produção
cd packages/database
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Database (Neon)
```bash
# Ver dados em produção
DATABASE_URL="postgresql://..." npx prisma studio
```

---

## 📚 Documentação Adicional

- [README.md](../README.md) - Visão geral
- [SETUP.md](./SETUP.md) - Configuração do ambiente
- [STRUCTURE.md](./STRUCTURE.md) - Arquitetura
- [DEPLOY.md](./DEPLOY.md) - Guia de deploy
- [CHECKLIST.md](./CHECKLIST.md) - Status de features
- [CHANGELOG.md](../CHANGELOG.md) - Histórico de mudanças

---

## 💡 Dicas para Próxima Sessão

1. **Antes de fazer mudanças no código:**
   - Sempre verificar o schema Prisma primeiro
   - Confirmar tipos e relações
   - Testar localmente antes de push

2. **Ao trabalhar com Prisma:**
   - Decimal → Number() para aritmética
   - Verificar nomes exatos de campos e relações
   - Usar unique constraints corretas

3. **Ao trabalhar com Next.js 14:**
   - Route handlers: apenas exports de HTTP methods
   - onClick handlers: precisa 'use client'
   - Server components: não podem passar funções

4. **Checklist antes de deploy:**
   - [ ] `npm run build` passa localmente?
   - [ ] Todos os tipos TypeScript corretos?
   - [ ] Variáveis de ambiente configuradas?
   - [ ] Schema Prisma alinhado com código?

---

## 🎯 Objetivos de Curto Prazo

### Semana 1-2
- [ ] Implementar UI de Login/Cadastro completa
- [ ] Conectar produtos com dados reais
- [ ] Sistema de busca e filtros funcionais

### Semana 3-4
- [ ] Carrinho de compras completo
- [ ] Checkout flow
- [ ] Integração Mercado Pago MVP

### Mês 2
- [ ] Upload de imagens (S3)
- [ ] Dashboard do vendedor
- [ ] Sistema de avaliações

---

**Última Atualização:** 14 de Janeiro de 2025, 18:52 UTC
**Versão:** 0.1.2
**Status:** ✅ Deploy em produção bem-sucedido
