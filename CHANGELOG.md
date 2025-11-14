# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Em Desenvolvimento
- Implementação de autenticação completa (NextAuth.js + JWT)
- Endpoints da API para Products, Courses, Orders
- Integração com Mercado Pago
- Sistema de carrinho de compras

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
