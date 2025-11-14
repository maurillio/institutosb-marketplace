# Setup Completo - The Beauty Pro

Este guia detalha todos os passos para configurar o ambiente de desenvolvimento do **The Beauty Pro**.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (recomendamos npm)
- **Docker** e **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### Contas Necessárias

Para rodar o projeto completo em produção, você precisará de:

- **Mercado Pago**: Para processar pagamentos
- **AWS Account**: Para storage S3 (imagens e vídeos)
- **Neon** ou outro PostgreSQL: Para o banco de dados em produção
- **Vercel**: Para deploy do frontend (opcional)

## 🚀 Setup do Ambiente Local

### 1. Clone o Repositório

```bash
git clone https://github.com/maurillio/institutosb-marketplace.git
cd institutosb-marketplace
```

### 2. Instale as Dependências

```bash
npm install
```

Isso instalará todas as dependências do monorepo (frontend, backend e packages).

### 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thebeautypro?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Mercado Pago (deixe em branco para desenvolvimento inicial)
MERCADO_PAGO_ACCESS_TOKEN=""
MERCADO_PAGO_PUBLIC_KEY=""

# AWS S3 (deixe em branco para desenvolvimento inicial)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="thebeautypro"

# API
NEXT_PUBLIC_API_URL="http://localhost:3001"
API_PORT=3001
```

### 4. Suba o Banco de Dados com Docker

Inicie o PostgreSQL, Redis e pgAdmin:

```bash
docker-compose up -d
```

Verifique se os containers estão rodando:

```bash
docker-compose ps
```

Você deve ver:
- `thebeautypro-postgres` (porta 5432)
- `thebeautypro-redis` (porta 6379)
- `thebeautypro-pgadmin` (porta 5050)

### 5. Execute as Migrations do Prisma

Entre na pasta do package database:

```bash
cd packages/database
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

(Opcional) Popule o banco com dados iniciais:

```bash
npm run db:seed
```

Volte para a raiz:

```bash
cd ../..
```

### 6. Inicie o Ambiente de Desenvolvimento

Na raiz do projeto, execute:

```bash
npm run dev
```

Isso iniciará:
- **Frontend (Next.js)**: http://localhost:3000
- **Backend (NestJS)**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api/docs

## 🔍 Verificando a Instalação

### Frontend
Acesse http://localhost:3000. Você deve ver a página inicial do The Beauty Pro.

### Backend
Acesse http://localhost:3001. Você deve ver:
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T...",
  "service": "The Beauty Pro API"
}
```

### Documentação da API
Acesse http://localhost:3001/api/docs para ver toda a documentação interativa da API (Swagger).

### pgAdmin (Gerenciador de Banco)
Acesse http://localhost:5050

- **Email**: admin@thebeautypro.com
- **Senha**: admin123

Adicione uma nova conexão:
- **Host**: postgres
- **Port**: 5432
- **Database**: thebeautypro
- **Username**: postgres
- **Password**: postgres

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Inicia todos os apps em modo de desenvolvimento
npm run dev

# Inicia apenas o frontend
cd apps/web && npm run dev

# Inicia apenas o backend
cd apps/api && npm run dev
```

### Build

```bash
# Build de todos os apps
npm run build
```

### Database

```bash
# Abrir o Prisma Studio (GUI para o banco)
cd packages/database && npx prisma studio

# Criar uma nova migration
cd packages/database && npx prisma migrate dev --name nome_da_migration

# Resetar o banco de dados (CUIDADO!)
cd packages/database && npx prisma migrate reset
```

### Linting e Formatação

```bash
# Lint
npm run lint

# Formatar código
npm run format
```

### Docker

```bash
# Parar todos os containers
docker-compose down

# Parar e remover volumes (deleta os dados!)
docker-compose down -v

# Ver logs dos containers
docker-compose logs -f
```

## 🔐 Credenciais de Teste

Após executar o seed, você terá as seguintes contas de teste:

### Admin
- **Email**: admin@thebeautypro.com
- **Senha**: admin123

### Vendedor
- **Email**: vendedor@example.com
- **Senha**: admin123

### Instrutor
- **Email**: instrutor@example.com
- **Senha**: admin123

## ⚠️ Troubleshooting

### Erro: "Port 5432 already in use"
Você já tem um PostgreSQL rodando localmente. Pare-o ou mude a porta no `docker-compose.yml`.

### Erro: "Cannot find module @thebeautypro/database"
Execute `npm install` na raiz do projeto novamente e depois execute `npx prisma generate` na pasta `packages/database`.

### Erro: "PrismaClient is not available"
Execute:
```bash
cd packages/database
npx prisma generate
```

### Erro: "NEXTAUTH_SECRET must be set"
Certifique-se de que seu arquivo `.env` tem a variável `NEXTAUTH_SECRET` definida.

## 📱 Próximos Passos

Agora que seu ambiente está configurado, você pode:

1. Explorar o código em `apps/web/src`
2. Criar novos endpoints na API em `apps/api/src/modules`
3. Ver a documentação completa em [STRUCTURE.md](./STRUCTURE.md)
4. Verificar o checklist de funcionalidades em [CHECKLIST.md](./CHECKLIST.md)

## 🚢 Deploy em Produção

Para instruções de deploy em produção (Vercel + Neon + AWS), veja [DEPLOY.md](./DEPLOY.md) (em breve).
