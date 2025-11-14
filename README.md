# The Beauty Pro 💄

> Plataforma completa e escalável de marketplace para o mercado da beleza

## 🎯 Visão Geral

The Beauty Pro é um ecossistema digital definitivo para a indústria da beleza, conectando profissionais, estudantes, marcas e consumidores em uma única plataforma robusta e escalável.

### Funcionalidades Principais

- 🛍️ **Marketplace de Produtos**: Venda de produtos novos e usados
- 📚 **Plataforma EAD**: Cursos online com área de membros completa
- 📅 **Cursos Presenciais**: Sistema de agenda e gestão de turmas
- 💳 **Split de Pagamento**: Integração com Mercado Pago
- 👥 **Multi-perfil**: Mesma conta pode comprar e vender
- 📊 **Dashboard Completo**: Analytics e gestão de vendas
- ⭐ **Sistema de Avaliações**: Reviews de produtos e cursos
- 📱 **Mobile-First**: Design responsivo para todos os dispositivos

## 🏗️ Arquitetura

Este é um monorepo gerenciado com **Turborepo**, contendo:

```
the-beauty-pro/
├── apps/
│   ├── web/          # Next.js 14 - Frontend
│   └── api/          # NestJS - Backend API
├── packages/
│   ├── database/     # Prisma Schema + Migrations
│   ├── ui/           # Componentes UI compartilhados
│   └── types/        # TypeScript types compartilhados
└── docs/             # Documentação
```

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI**
- **NextAuth.js** (Autenticação)

### Backend
- **NestJS** (Node.js Framework)
- **PostgreSQL** (Database)
- **Prisma ORM**
- **Redis** (Cache)

### Infraestrutura
- **Vercel** (Frontend)
- **Neon** (PostgreSQL)
- **AWS S3** (Storage)
- **Mercado Pago** (Pagamentos)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Redis (opcional, para cache)
- Conta Mercado Pago
- Conta AWS (para S3)

## 🛠️ Setup de Desenvolvimento

### 1. Clone o repositório

```bash
git clone https://github.com/maurillio/institutosb-marketplace.git
cd institutosb-marketplace
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais.

### 4. Suba o banco de dados local (Docker)

```bash
docker-compose up -d
```

### 5. Execute as migrations

```bash
cd packages/database
npx prisma migrate dev
npx prisma generate
```

### 6. Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

Isso iniciará:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia todos os apps em modo desenvolvimento
npm run build        # Build de produção de todos os apps
npm run lint         # Executa linting
npm run format       # Formata o código com Prettier
npm run clean        # Limpa builds e caches
```

## 📚 Documentação

- [Setup Completo](./docs/SETUP.md) - Configuração do ambiente de desenvolvimento
- [Estrutura do Projeto](./docs/STRUCTURE.md) - Arquitetura e organização do código
- [Deploy em Produção](./docs/DEPLOY.md) - **NOVO!** Guia completo de deploy (Vercel + Neon)
- [Checklist de Funcionalidades](./docs/CHECKLIST.md) - Status de todas as features (~250+)
- [API Documentation](./docs/API.md) - Documentação da API (em breve)

## 🗄️ Schema do Banco de Dados

O schema completo inclui:

- Usuários e autenticação
- Produtos (novos/usados)
- Cursos (online/presenciais)
- Pedidos e pagamentos
- Avaliações e reviews
- Sistema de assinaturas
- Agenda de cursos
- Área de membros

Veja o schema completo em: `packages/database/prisma/schema.prisma`

## 🚀 Deploy em Produção

**✅ LIVE:** https://thebeautypro.vercel.app/

Para instruções completas e detalhadas de deploy, consulte: **[DEPLOY.md](./docs/DEPLOY.md)**

### Status do Deploy

| Serviço | Status | URL/Info |
|---------|--------|----------|
| **Frontend** | ✅ Live | https://thebeautypro.vercel.app/ |
| **Database** | ✅ Neon | PostgreSQL (Neon - us-east-1) |
| **Branch** | `claude/beauty-pro-marketplace-setup-01MTUpYaZQTmpRkLc6v5oEi8` | Auto-deploy ativo |

### Quick Start

**Frontend (Vercel):**
1. ✅ Conectado ao GitHub
2. ✅ Variáveis de ambiente configuradas
3. ✅ Deploy automático ativo!

**Database (Neon):**
```bash
# Aplique as migrations no banco de produção
cd packages/database
npx prisma migrate deploy
```

💡 **Custo estimado:** ~$0-5/mês com as free tiers (perfeitamente viável para MVP!)

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com o time.

## 📝 Licença

Proprietary - Todos os direitos reservados © 2025 The Beauty Pro

## 👤 Autor

**Maurillio**

---

Desenvolvido com ❤️ para revolucionar o mercado da beleza
