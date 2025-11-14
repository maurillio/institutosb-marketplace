# Deploy em Produção - The Beauty Pro

Este guia detalha como fazer deploy completo do **The Beauty Pro** em produção.

## 🎯 Stack de Produção

- **Frontend**: Vercel
- **Database**: Neon (PostgreSQL)
- **Backend**: Vercel (ou Railway/Render)
- **Storage**: AWS S3
- **Pagamentos**: Mercado Pago

---

## 📋 Pré-requisitos

Você precisará criar contas gratuitas em:

1. **Vercel** → https://vercel.com (Free tier é suficiente para começar)
2. **Neon** → https://neon.tech (Free tier: 0.5GB storage)
3. **Mercado Pago** → https://www.mercadopago.com.br/developers
4. **AWS** → https://aws.amazon.com (ou usar Vercel Blob Storage)

---

## 🗄️ Parte 1: Configurar Database no Neon

### 1.1 Criar Projeto no Neon

1. Acesse https://console.neon.tech
2. Clique em **"Create a Project"**
3. Configure:
   - **Project Name**: `thebeautypro-production`
   - **Region**: São Paulo (ou mais próxima do Brasil)
   - **PostgreSQL Version**: 15 (recomendado)
4. Clique em **"Create Project"**

### 1.2 Obter Connection String

Após criar o projeto, você verá a **Connection String**. Ela terá este formato:

```
postgresql://user:password@ep-cool-name-123456.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

**⚠️ IMPORTANTE: Copie e salve essa string! Você vai precisar dela.**

### 1.3 Aplicar Migrations no Neon

No seu terminal local:

```bash
# 1. Copie a connection string do Neon
# 2. Configure a variável de ambiente temporariamente
export DATABASE_URL="postgresql://user:password@ep-cool-name.sa-east-1.aws.neon.tech/neondb?sslmode=require"

# 3. Entre na pasta do database
cd packages/database

# 4. Aplique as migrations
npx prisma migrate deploy

# 5. (Opcional) Rode o seed para popular dados iniciais
npm run db:seed

# 6. Verifique se funcionou
npx prisma studio
```

✅ **Pronto!** Seu banco de produção está configurado.

---

## 🚀 Parte 2: Deploy do Frontend no Vercel

### 2.1 Conectar Repositório GitHub ao Vercel

#### Opção A: Via Interface Web (Recomendado - Mais Fácil)

1. Acesse https://vercel.com
2. Clique em **"Add New" → "Project"**
3. Clique em **"Import Git Repository"**
4. Selecione o repositório: `maurillio/institutosb-marketplace`
5. Configure o projeto:

   **Framework Preset:** Next.js
   **Root Directory:** `apps/web`
   **Build Command:** `cd ../.. && npm install && npm run build --filter=@thebeautypro/web`
   **Install Command:** `npm install`
   **Output Directory:** `apps/web/.next`

6. **Environment Variables** (adicione todas):

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.sa-east-1.aws.neon.tech/neondb?sslmode=require

# NextAuth
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=cole-uma-string-aleatoria-segura-aqui

# API URL (por enquanto vamos usar a mesma app)
NEXT_PUBLIC_API_URL=https://seu-dominio.vercel.app/api

# Mercado Pago (deixe em branco por enquanto se não tiver)
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_PUBLIC_KEY=

# AWS S3 (deixe em branco por enquanto se não tiver)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_BUCKET_NAME=
```

7. Clique em **"Deploy"**

#### Opção B: Via CLI

```bash
# 1. Instale o Vercel CLI
npm install -g vercel

# 2. Login no Vercel
vercel login

# 3. Na pasta raiz do projeto
vercel

# 4. Siga as instruções interativas
```

### 2.2 Gerar NEXTAUTH_SECRET

Para gerar um secret seguro:

```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado e use como valor de `NEXTAUTH_SECRET` no Vercel.

### 2.3 Verificar Deploy

1. Após o deploy, acesse a URL fornecida pelo Vercel (exemplo: `thebeautypro.vercel.app`)
2. Você deve ver a home page do The Beauty Pro!

---

## 🔧 Parte 3: Deploy do Backend (API)

Você tem 2 opções para o backend:

### Opção A: Serverless Functions na Vercel (Mais Simples)

Vamos configurar para rodar o NestJS como Serverless Functions no Vercel.

**1. Criar arquivo de configuração**

Crie `apps/api/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ]
}
```

**2. Deploy separado no Vercel**

```bash
cd apps/api
vercel
```

**3. Configure as variáveis de ambiente** (mesmas do frontend)

### Opção B: Railway (Recomendado para API NestJS completa)

**Railway oferece:**
- Container completo para NestJS
- Melhor para WebSockets e long-running processes
- Free tier: $5 de crédito/mês

**1. Criar conta no Railway**

Acesse: https://railway.app

**2. Deploy via GitHub**

1. No Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha `maurillio/institutosb-marketplace`
4. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

**3. Configure as variáveis de ambiente** (mesmas)

**4. Obtenha a URL da API**

Railway vai fornecer uma URL tipo: `https://thebeautypro-api.railway.app`

**5. Atualize no Vercel**

Volte no Vercel e atualize a variável:
```env
NEXT_PUBLIC_API_URL=https://thebeautypro-api.railway.app
```

---

## 🔐 Parte 4: Configurar AWS S3 (Storage)

### 4.1 Criar Bucket S3

1. Acesse AWS Console: https://console.aws.amazon.com/s3
2. Clique em **"Create bucket"**
3. Configure:
   - **Bucket name**: `thebeautypro-production`
   - **Region**: São Paulo (sa-east-1)
   - **Block all public access**: Desmarque (precisamos servir imagens)
4. Clique em **"Create bucket"**

### 4.2 Configurar CORS

No bucket criado, vá em **Permissions → CORS** e adicione:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://seu-dominio.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4.3 Criar IAM User

1. Acesse IAM: https://console.aws.amazon.com/iam
2. Vá em **Users → Add user**
3. Configure:
   - **User name**: `thebeautypro-s3`
   - **Access type**: Programmatic access
4. **Permissions**: Attach policy → `AmazonS3FullAccess`
5. Salve as credenciais:
   - **Access Key ID**
   - **Secret Access Key**

### 4.4 Adicionar no Vercel

Adicione as variáveis de ambiente:

```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=sa-east-1
AWS_BUCKET_NAME=thebeautypro-production
```

---

## 💳 Parte 5: Configurar Mercado Pago

### 5.1 Criar Aplicação

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações" → "Criar aplicação"**
3. Configure:
   - **Nome**: The Beauty Pro
   - **Produto**: Pagamentos online e via Checkout Pro
4. Clique em **"Criar aplicação"**

### 5.2 Obter Credenciais de Produção

**⚠️ ATENÇÃO:** Inicialmente você terá apenas credenciais de **Teste**. Para usar em produção, você precisa:

1. Homologar sua conta Mercado Pago (enviar documentos)
2. Após aprovação, obter as credenciais de **Produção**

**Credenciais de Teste (para desenvolvimento):**
- Access Token: `TEST-xxxx`
- Public Key: `TEST-xxxx`

**Credenciais de Produção:**
- Access Token: `APP-xxxx`
- Public Key: `APP-xxxx`

### 5.3 Configurar Webhook

No painel do Mercado Pago:

1. Vá em **"Webhooks"**
2. Configure a URL: `https://sua-api.railway.app/payments/webhook`
3. Selecione os eventos:
   - `payment`
   - `merchant_order`

### 5.4 Adicionar no Vercel

```env
MERCADO_PAGO_ACCESS_TOKEN=TEST-xxxx  # ou APP-xxxx em produção
MERCADO_PAGO_PUBLIC_KEY=TEST-xxxx    # ou APP-xxxx em produção
```

---

## 🔄 Parte 6: CI/CD Automático

Com Vercel conectado ao GitHub, você já tem CI/CD automático! ✅

Toda vez que você fizer um `git push` para a branch principal:
1. Vercel detecta automaticamente
2. Faz build do projeto
3. Deploy automático
4. URL atualizada

### 6.1 Proteger a Branch Principal

No GitHub:
1. Vá em **Settings → Branches**
2. Adicione regra para `main` (ou `master`)
3. Ative **"Require pull request reviews"**

---

## ✅ Checklist de Deploy

Use este checklist para garantir que tudo está configurado:

### Database (Neon)
- [x] Projeto criado no Neon
- [x] Connection string copiada
- [x] Migrations aplicadas (`prisma migrate deploy`)
- [x] Seed executado (opcional)
- [x] Backup automático configurado

### Frontend (Vercel)
- [x] Projeto importado do GitHub
- [x] Build passando com sucesso (35/35 páginas estáticas geradas)
- [x] Todas as variáveis de ambiente configuradas
- [x] NEXTAUTH_SECRET gerado e configurado
- [x] Site acessível via URL do Vercel
- [ ] Domínio customizado configurado (opcional)

### Backend (Railway/Vercel)
- [ ] API deployada
- [ ] Variáveis de ambiente configuradas
- [ ] Health check funcionando (`GET /`)
- [ ] Swagger docs acessível (`GET /api/docs`)
- [ ] CORS configurado para o domínio do frontend

### Storage (AWS S3)
- [ ] Bucket criado
- [ ] CORS configurado
- [ ] IAM User criado
- [ ] Credenciais no Vercel

### Pagamentos (Mercado Pago)
- [ ] Aplicação criada
- [ ] Credenciais (teste ou produção) configuradas
- [ ] Webhook configurado
- [ ] Testado com pagamento real

---

## 🔍 Verificação Final

Teste estas funcionalidades em produção:

1. **Home Page** → Acesse sua URL e veja se carrega
2. **Database** → Tente fazer login com as credenciais do seed
3. **API** → Acesse `sua-api/api/docs` para ver o Swagger
4. **Health Check** → `sua-api/` deve retornar `{"status": "ok"}`

---

## ✅ Status Atual do Deploy (v0.1.2)

### Deployment Bem-Sucedido! 🎉

**Data:** 14 de Janeiro de 2025
**Versão:** 0.1.2
**Status:** ✅ LIVE em Produção

#### Correções Aplicadas

Durante o processo de deploy, foram identificados e corrigidos **21 erros** de TypeScript/build:

1. ✅ NextAuth route export restrictions
2. ✅ Prisma schema relations alignment (Course, Product, Order)
3. ✅ Decimal type arithmetic conversions
4. ✅ Enum type corrections (PaymentStatus, OrderStatus)
5. ✅ Client/Server component boundaries
6. ✅ Field name corrections (imageUrl → images, date → startDate)
7. ✅ Unique constraint fixes
8. ✅ Removed non-existent relations

**Resultado:**
- Build TypeScript: ✅ Passou
- Páginas Estáticas: ✅ 35/35 geradas
- Deploy Vercel: ✅ Bem-sucedido
- URL Live: https://institutosb-marketplace-ayk1itkfa.vercel.app

Para detalhes completos das correções, consulte: [CHANGELOG.md](../CHANGELOG.md#012---2025-01-14)

---

## 🆘 Troubleshooting

### "Build failed" no Vercel

**Causa comum:** Erros de TypeScript ou imports incorretos.

**Solução:**
```bash
# Teste o build localmente primeiro
npm run build

# Se passar localmente mas falhar no Vercel, verifique:
# 1. Root Directory está correto? (apps/web)
# 2. Todas as dependências estão no package.json?
```

### "Cannot connect to database"

**Causa comum:** Connection string incorreta ou IP não autorizado.

**Solução:**
- Verifique se a connection string está correta
- Neon: Certifique-se de que `sslmode=require` está na string
- Verifique se a variável `DATABASE_URL` está configurada

### "Module not found" no build

**Causa comum:** Monorepo não está resolvendo packages internos.

**Solução:**
```bash
# No build command, adicione:
npm install --workspace=@thebeautypro/web --workspace=@thebeautypro/database
```

---

## 🚀 Próximos Passos

Após o deploy inicial:

1. **Monitoramento**: Configure Sentry para error tracking
2. **Analytics**: Adicione Google Analytics / Vercel Analytics
3. **Domínio**: Configure um domínio customizado
4. **SSL**: Vercel já fornece SSL automático ✅
5. **CDN**: Vercel já tem CDN global ✅
6. **Backups**: Configure backups automáticos no Neon

---

## 💰 Custos Estimados (Mensal)

Com as free tiers:

- **Vercel**: $0 (Hobby Plan)
- **Neon**: $0 (Free tier - 0.5GB)
- **Railway**: $5 de crédito grátis/mês
- **AWS S3**: ~$0.50 (primeiros 5GB grátis)
- **Mercado Pago**: Apenas comissão por transação (5-7%)

**Total inicial: ~$0-5/mês** (perfeitamente viável para MVP!)

Conforme o projeto crescer, os custos aumentarão proporcionalmente ao uso.

---

## 📚 Recursos Adicionais

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Railway Docs**: https://docs.railway.app
- **Mercado Pago Docs**: https://www.mercadopago.com.br/developers

---

🎉 **Parabéns! Seu The Beauty Pro está no ar!**

Desenvolvido com ❤️ para revolucionar o mercado da beleza
