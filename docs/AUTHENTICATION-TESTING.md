# 🔐 Guia de Teste - Sistema de Autenticação

## ✅ Fase 1 Completa!

O sistema de autenticação completo foi implementado e está pronto para testes.

## 📋 Componentes Implementados

### Backend
- ✅ NextAuth.js API Route configurado
- ✅ Endpoint de registro de usuários
- ✅ Validação de dados com Zod
- ✅ Hash de senhas com bcrypt
- ✅ Sessões JWT com 7 dias de validade
- ✅ Verificação de status de conta (somente ACTIVE)
- ✅ Rastreamento de último login

### Frontend
- ✅ Página de Login (`/entrar`)
- ✅ Página de Cadastro (`/cadastro`)
- ✅ Componente UserMenu com dropdown
- ✅ Header atualizado com UserMenu
- ✅ Layout de autenticação
- ✅ SessionProvider configurado

### Segurança
- ✅ Middleware de proteção de rotas
- ✅ Guards baseados em roles (CUSTOMER, SELLER, INSTRUCTOR, ADMIN)
- ✅ Redirecionamento automático para login
- ✅ Tipos TypeScript estendidos

## 🧪 Como Testar

### 1. Verificar Variáveis de Ambiente

Certifique-se que o Vercel tem as seguintes variáveis configuradas:

```env
DATABASE_URL=postgresql://neondb_owner:...
NEXTAUTH_URL=https://thebeautypro.vercel.app
NEXTAUTH_SECRET=<sua-chave-secreta>
```

### 2. Testar Fluxo de Cadastro

1. Acesse: `https://thebeautypro.vercel.app/cadastro`
2. Preencha o formulário:
   - Nome: "Teste Usuário"
   - Email: "teste@example.com"
   - Senha: "senha123"
   - Confirmar Senha: "senha123"
3. Clique em "Cadastrar"
4. ✅ Deve aparecer mensagem de sucesso
5. ✅ Deve fazer login automaticamente
6. ✅ Deve redirecionar para home
7. ✅ Menu de usuário deve aparecer no header

### 3. Testar Fluxo de Login

1. Acesse: `https://thebeautypro.vercel.app/entrar`
2. Use as credenciais:
   - Email: "teste@example.com"
   - Senha: "senha123"
3. Clique em "Entrar"
4. ✅ Deve fazer login
5. ✅ Deve redirecionar para home
6. ✅ Menu de usuário deve aparecer

### 4. Testar Menu de Usuário

Com usuário logado, clique no avatar/ícone no header:

1. ✅ Dropdown deve abrir
2. ✅ Deve mostrar nome e email
3. ✅ Links devem aparecer:
   - Minha Conta
   - Meus Pedidos
   - Meus Cursos
4. ✅ Botão "Sair" deve aparecer
5. ✅ Clicar fora deve fechar o menu

### 5. Testar Roles e Permissões

Para testar roles diferentes, você pode:

**A) Usar dados do seed (se já rodou `npm run db:seed`):**
```
Admin: admin@thebeautypro.com / admin123
Vendedor: vendedor@example.com / admin123
Instrutor: instrutor@example.com / admin123
```

**B) Atualizar role manualmente no Neon:**
```sql
UPDATE "User"
SET roles = ARRAY['SELLER']::text[]
WHERE email = 'teste@example.com';
```

**Verificar menu baseado em role:**
- ✅ CUSTOMER: Minha Conta, Meus Pedidos, Meus Cursos
- ✅ SELLER: + Dashboard Vendedor
- ✅ INSTRUCTOR: + Dashboard Instrutor
- ✅ ADMIN: + Administração

### 6. Testar Proteção de Rotas

**Sem estar logado:**

1. Tente acessar: `https://thebeautypro.vercel.app/minha-conta`
2. ✅ Deve redirecionar para `/entrar`

**Logado como CUSTOMER:**

1. Tente acessar: `https://thebeautypro.vercel.app/dashboard/vendedor`
2. ✅ Deve redirecionar para home

**Logado como SELLER:**

1. Acesse: `https://thebeautypro.vercel.app/dashboard/vendedor`
2. ✅ Deve permitir acesso

**Logado como ADMIN:**

1. Acesse: `https://thebeautypro.vercel.app/admin`
2. ✅ Deve permitir acesso

### 7. Testar Logout

1. Clique no avatar no header
2. Clique em "Sair"
3. ✅ Deve fazer logout
4. ✅ Deve redirecionar para home
5. ✅ Header deve mostrar ícone de login novamente

## 🐛 Problemas Comuns

### Erro: "NEXTAUTH_URL not configured"
**Solução:** Adicionar `NEXTAUTH_URL` nas variáveis de ambiente do Vercel

### Erro: "prisma is not defined"
**Solução:** Verificar se as migrations rodaram (build script deve incluir `db:prepare`)

### Menu não abre/fecha
**Solução:** Verificar se o componente Header está com `'use client'` no topo

### Não redireciona após login
**Solução:** Verificar se SessionProvider está no layout root

## 📊 Checklist de Validação

- [ ] Cadastro de novo usuário funciona
- [ ] Login com credenciais válidas funciona
- [ ] Erro aparece com credenciais inválidas
- [ ] Menu de usuário abre e fecha corretamente
- [ ] Menu mostra informações do usuário
- [ ] Links do menu estão corretos
- [ ] Logout funciona
- [ ] Rotas protegidas redirecionam
- [ ] Roles controlam acesso aos dashboards
- [ ] Admin tem acesso a todas as áreas

## 🚀 Próximos Passos

Após validar todos os testes acima, podemos seguir para:

**Fase 2: Marketplace de Produtos**
- Sistema de categorias
- Listagem de produtos
- Filtros e busca
- Carrinho de compras
- Favoritos

---

**Status:** ✅ Fase 1 Completa - Pronta para Testes
**Deploy:** Automático via Vercel
**Database:** Neon PostgreSQL
**URL:** https://thebeautypro.vercel.app
