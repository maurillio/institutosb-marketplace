# Contexto do Projeto - The Beauty Pro Marketplace

## Estrutura
- Monorepo Turborepo com apps/web (Next.js 14) e packages/database (Prisma)
- Deploy: Vercel (thebeautypro.vercel.app)
- **Banco de Dados: Neon PostgreSQL** (não Vercel Postgres!)
- Stack: Next.js 14, TypeScript, Tailwind, Prisma, NextAuth, Vercel Blob

## Principais Rotas
- `/` - Home
- `/produtos`, `/categorias` - Produtos
- `/cursos` - Cursos
- `/dashboard/vendedor`, `/dashboard/instrutor` - Dashboards
- `/perfil` - Perfil do usuário

## Funcionalidades Implementadas
- Auth (NextAuth)
- Upload de imagens (Vercel Blob via /api/upload)
- Marketplace (produtos)
- Cursos online
- Wishlist
- Carrinho
- PWA

## Problemas Conhecidos a Corrigir
1. ~~Placeholders via.placeholder.com não carregam (usar imagem local)~~ ✅ CORRIGIDO
2. ~~PWA icons faltando (/icons/icon-*.png)~~ ✅ CORRIGIDO
3. ~~Meta tag PWA deprecated~~ ✅ CORRIGIDO
4. ~~Erros 401/404 em APIs são normais quando não autenticado ou sem perfil configurado~~ ✅ CORRIGIDO
5. ~~Erro 400 em imagens Vercel Blob (configuração next.config)~~ ✅ CORRIGIDO
6. ~~Perfil não salva alterações (JWT não atualiza)~~ ✅ CORRIGIDO
7. ~~Dashboards vendedor/instrutor retornam 404 (perfis não criados)~~ ✅ CORRIGIDO
8. ~~Erro rating.toFixed no dashboard vendedor (Decimal não convertido)~~ ✅ CORRIGIDO
9. ~~Perfil não exibe dados salvos (campo .image ao invés de .avatar)~~ ✅ CORRIGIDO
10. ~~Warning autocomplete em campos de senha~~ ✅ CORRIGIDO
11. ~~Erro 400 ao criar curso (faltando campo slug)~~ ✅ CORRIGIDO
12. ~~Sistema de categorias não configurado~~ ✅ CORRIGIDO (categorias criadas no Neon)
13. ~~Erro 500 ao criar produto (sellerId errado)~~ ✅ CORRIGIDO

## Componentes Principais
- Header/Footer: `@/components/layout/`
- ProductCard: `@/components/products/product-card`
- ImageUpload: `@/components/ImageUpload`

## Branch Atual
main (deployado automaticamente no Vercel)
