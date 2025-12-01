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
18. ~~TypeError: price.toFixed is not a function na página de produtos~~ ⚠️ TENTATIVA DE CORREÇÃO (Decimal → Number em TODAS as APIs de produtos)
19. ~~Campos de preço aceitam letras e não têm formatação clara~~ ⚠️ IMPLEMENTADO (CurrencyInput com formatação R$)
20. ~~TypeError: Cannot read properties of undefined (reading 'avatar') na página /produtos/[id]~~ ⚠️ TENTATIVA DE CORREÇÃO (interface corrigida para seller.avatar)
21. ~~Erro 404 ao fazer prefetch de /vendedor/[id] (rota não existe)~~ ⚠️ TENTATIVA DE CORREÇÃO (link removido temporariamente)
22. ~~Erro 500 ao criar curso - campo duration não convertido corretamente~~ ⚠️ TENTATIVA DE CORREÇÃO (conversão string→Int com tratamento de vazio)

## Componentes Principais
- Header/Footer: `@/components/layout/`
- ProductCard: `@/components/products/product-card`
- ImageUpload: `@/components/ImageUpload`
- CurrencyInput: `@/components/CurrencyInput` (formatação R$ automática)

## Últimas Alterações
- Commit `a049e6b`: Correção da conversão do campo duration na criação de curso
- Commit `437ea74`: Documentação do problema 21 (404 em /vendedor/[id])
- Commit `2b7c0fb`: Remoção de link para /vendedor/[id] (rota não implementada)
- Commit `61923db`: Documentação do problema 20 (avatar em /produtos/[id])
- Commit `5ef94c6`: Correção de estrutura seller (avatar e rating) em /produtos/[id]
- Commit `4144f16`: Correção do link de edição em dashboard vendedor

## Branch Atual
main (deployado automaticamente no Vercel)
