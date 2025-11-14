# 🗄️ Aplicar Migrations no Banco Neon

Este guia mostra como aplicar as migrations no seu banco de dados Neon em produção.

## ⚡ Opção 1: Script Automático (Mais Fácil)

Execute o script que já está pronto:

```bash
bash apply-migrations.sh
```

Isso vai:
1. ✅ Conectar no banco Neon
2. ✅ Criar todas as tabelas
3. ✅ Perguntar se você quer popular com dados de exemplo

---

## 🔧 Opção 2: Manual (Passo a Passo)

Se preferir fazer manualmente:

### 1. Entre na pasta do database

```bash
cd packages/database
```

### 2. Configure a variável de ambiente

```bash
export DATABASE_URL="postgresql://neondb_owner:npg_H8BWMk4aEgdD@ep-little-king-ahhg8snu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 3. Aplique o schema

```bash
npx prisma db push
```

### 4. (Opcional) Popule com dados de exemplo

```bash
npm run db:seed
```

---

## 📊 O Que Será Criado

As seguintes tabelas serão criadas no banco:

### Usuários e Autenticação
- ✅ `users` - Usuários do sistema
- ✅ `accounts` - Contas OAuth (NextAuth)
- ✅ `sessions` - Sessões de usuário
- ✅ `verification_tokens` - Tokens de verificação
- ✅ `seller_profiles` - Perfis de vendedores
- ✅ `instructor_profiles` - Perfis de instrutores
- ✅ `addresses` - Endereços dos usuários

### Produtos
- ✅ `categories` - Categorias
- ✅ `products` - Produtos (novos/usados)
- ✅ `product_variations` - Variações de produtos

### Cursos
- ✅ `courses` - Cursos (online/presenciais)
- ✅ `course_modules` - Módulos dos cursos
- ✅ `course_lessons` - Aulas dos cursos
- ✅ `course_schedules` - Agendas de cursos presenciais
- ✅ `course_enrollments` - Matrículas
- ✅ `lesson_progress` - Progresso dos alunos

### Pedidos e Pagamentos
- ✅ `orders` - Pedidos
- ✅ `order_items` - Itens dos pedidos
- ✅ `payments` - Pagamentos (Mercado Pago)
- ✅ `payouts` - Saques dos vendedores

### Avaliações
- ✅ `reviews` - Avaliações de produtos e cursos

### Notificações
- ✅ `notifications` - Sistema de notificações

**Total:** 21 tabelas

---

## 🌱 Dados de Exemplo (Seed)

Se você executar o seed, serão criados:

### Usuários
- **Admin**
  - Email: `admin@thebeautypro.com`
  - Senha: `admin123`
  - Roles: Admin, Seller, Instructor

- **Vendedor**
  - Email: `vendedor@example.com`
  - Senha: `admin123`
  - Loja: "Beleza da Maria"

- **Instrutor**
  - Email: `instrutor@example.com`
  - Senha: `admin123`
  - Bio: "Especialista em maquiagem profissional"

### Categorias
- Cabelo
- Maquiagem
- Skincare
- Unhas

### Produtos
- Shampoo Profissional 500ml (R$ 49,90)

### Cursos
- Curso Completo de Maquiagem Profissional (R$ 299,00)
  - 1 módulo com 2 aulas

---

## ✅ Verificar se Funcionou

Após aplicar as migrations:

1. Acesse: https://console.neon.tech
2. Selecione seu projeto `thebeautypro-production`
3. Vá em **Tables**
4. Você deve ver todas as 21 tabelas criadas

Ou teste diretamente no site:
👉 https://thebeautypro.vercel.app/

---

## ❌ Problemas Comuns

### "Cannot connect to database"
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o Neon está online

### "Table already exists"
- As migrations já foram aplicadas
- Use `npx prisma db push --force-reset` para resetar (⚠️ deleta todos os dados!)

### "Prisma binary not found"
- Execute: `npx prisma generate`
- Tente novamente

---

## 🆘 Precisa de Ajuda?

Se tiver problemas, você pode:

1. Verificar os logs do Prisma
2. Acessar o Neon Console para ver o banco
3. Executar manualmente via SQL (não recomendado)

---

**Depois de aplicar as migrations, seu banco estará 100% pronto para produção!** 🎉
