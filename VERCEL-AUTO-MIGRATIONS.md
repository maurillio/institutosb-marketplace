# 🚀 Migrations Automáticas no Vercel

## ✅ Configuração Completa!

O sistema está configurado para **aplicar migrations automaticamente** a cada deploy no Vercel!

## Como Funciona

Quando você faz um deploy no Vercel:

1. ✅ Vercel faz `npm install`
2. ✅ Vercel executa `npm run build`
3. ✅ Nosso build roda **automaticamente**:
   - `npm run db:prepare` → Gera Prisma Client e aplica migrations
   - `next build` → Faz o build do Next.js
4. ✅ **Banco atualizado automaticamente!**

## 🎯 O Que Você Precisa Fazer

### NADA! 🎉

Sério, não precisa fazer nada. Mas se quiser forçar um novo deploy agora:

### Opção 1: Via Interface Vercel (30 segundos)

1. Acesse: https://vercel.com/maurillios-projects/thebeautypro
2. Vá em **"Deployments"**
3. Clique nos **3 pontinhos** do último deployment
4. Clique em **"Redeploy"**
5. Confirme

**Pronto!** O Vercel vai:
- ✅ Aplicar todas as migrations no Neon
- ✅ Criar as 21 tabelas
- ✅ Fazer o build e deploy

### Opção 2: Via Git (para qualquer mudança futura)

```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

## 🗄️ O Que Será Criado no Banco

Durante o próximo deploy, o Vercel criará automaticamente:

### 21 Tabelas:

**Usuários (7):**
- users, accounts, sessions, verification_tokens
- seller_profiles, instructor_profiles, addresses

**Produtos (3):**
- categories, products, product_variations

**Cursos (6):**
- courses, course_modules, course_lessons
- course_schedules, course_enrollments, lesson_progress

**Pedidos (4):**
- orders, order_items, payments, payouts

**Outros (2):**
- reviews, notifications

## ✅ Como Verificar se Funcionou

### 1. Via Vercel Logs

1. Acesse seu deployment no Vercel
2. Vá em **"Logs"**
3. Procure por:
   ```
   📦 Gerando Prisma Client...
   🚀 Sincronizando schema com o banco...
   ✅ Migrations aplicadas com sucesso!
   ```

### 2. Via Neon Console

1. Acesse: https://console.neon.tech
2. Selecione seu projeto
3. Vá em **"Tables"**
4. Você deve ver todas as 21 tabelas

### 3. Testando o Site

1. Acesse: https://thebeautypro.vercel.app/
2. O site deve carregar sem erros

## 🔧 Migrations Futuras

**Toda vez que você:**
- Modificar o `schema.prisma`
- Fazer push no GitHub

**O Vercel automaticamente:**
- ✅ Aplica as novas migrations
- ✅ Atualiza o banco
- ✅ Faz deploy

## 🌱 Dados de Exemplo (Seed)

Para adicionar dados de exemplo, você ainda precisa executar manualmente:

```bash
cd packages/database
export DATABASE_URL="postgresql://neondb_owner:npg_H8BWMk4aEgdD@ep-little-king-ahhg8snu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
npm run db:seed
```

Isso criará:
- Admin: admin@thebeautypro.com / admin123
- Vendedor: vendedor@example.com / admin123
- Instrutor: instrutor@example.com / admin123
- Categorias e produtos de exemplo

## ⚠️ Importante

- O comando `db push` é **idempotent** (pode rodar múltiplas vezes sem problemas)
- Ele **não deleta dados** existentes
- Ele sincroniza o schema automaticamente

## 🎉 Resumo

**Antes:**
❌ Você tinha que executar `npx prisma migrate deploy` manualmente

**Agora:**
✅ Cada deploy no Vercel aplica as migrations automaticamente!

---

**Pronto! Seu banco está sempre sincronizado com o código!** 🚀
