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
- Auth (NextAuth com authOptions exportado)
- Upload de imagens (Vercel Blob via /api/upload)
- Marketplace (produtos com conversão Decimal→Number na API)
- Cursos online
- Wishlist
- Carrinho
- PWA
- Input monetário com formatação automática (R$)

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
13. ~~Erro 500 ao criar produto (sellerId errado - FK constraint)~~ ✅ CORRIGIDO
14. ~~Logout após atualizar perfil e dar F5~~ ⚠️ EM INVESTIGAÇÃO (logs adicionados - ver docs/DEBUG-LOGS.md)
15. ~~Erro ao criar produto - enum ProductCondition inválido (USED)~~ ✅ CORRIGIDO
16. ~~Produtos não aparecem na listagem (busca por SellerProfile.id errado)~~ ✅ CORRIGIDO
17. ~~Application error na listagem - campo imageUrl não existe~~ ⚠️ TENTATIVA DE CORREÇÃO (ErrorBoundary + conversão na API)
18. ~~TypeError: price.toFixed is not a function na página de produtos~~ ⚠️ TENTATIVA DE CORREÇÃO (Decimal → Number em /api/products)
19. ~~Campos de preço aceitam letras e não têm formatação clara~~ ⚠️ IMPLEMENTADO (CurrencyInput com formatação R$)

## Componentes Principais
- Header/Footer: `@/components/layout/`
- ProductCard: `@/components/products/product-card`
- ImageUpload: `@/components/ImageUpload`
- CurrencyInput: `@/components/CurrencyInput` (formatação R$ automática)

## Últimas Alterações
- Commit `d4d8047`: Conversão Decimal→Number na API de produtos
- Commit `3009bc0`: Componente CurrencyInput para formatação monetária
- Commit `6f174a2`: Correção de interface TypeScript em categorias/[slug]
- Commit `6f174a2`: Ajuste de chamada de API (categoryId ao invés de category)

## Branch Atual
main (deployado automaticamente no Vercel)
