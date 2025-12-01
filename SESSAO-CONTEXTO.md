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
- Cursos online (com gestão de módulos e aulas)
- Dashboard do instrutor (criar/editar cursos, módulos e aulas)
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
23. ~~TypeError: Cannot read properties of undefined (reading 'name') no dashboard instrutor~~ ⚠️ TENTATIVA DE CORREÇÃO (removida referência a course.category)
24. ~~TypeError: Cannot read properties of undefined (reading 'name') na página de detalhes do curso~~ ⚠️ TENTATIVA DE CORREÇÃO (removida category, corrigida estrutura instructor)
25. **Imagens 404 - produtos e cursos não têm arquivos físicos** ⚠️ CORREÇÃO PENDENTE
   - Erro: GET /images/products/*.jpg retorna 404
   - Erro: Next.js Image retorna 400 Bad Request ao tentar otimizar imagens inexistentes
   - Solução temporária: Script SQL `fix-images-placeholder.sql` para usar `/placeholder.png`
   - Solução definitiva: Upload de imagens reais via dashboard ou Vercel Blob

## Componentes Principais
- Header/Footer: `@/components/layout/`
- ProductCard: `@/components/products/product-card`
- ImageUpload: `@/components/ImageUpload`
- CurrencyInput: `@/components/CurrencyInput` (formatação R$ automática)

## Últimas Alterações (Sessão de Modernização)
- Commit `8d29497`: **Menu mobile funcional com Sheet** ✨
  - Painel deslizante com overlay e animação suave
  - Navegação completa para mobile
  - Seção de usuário dinâmica (autenticado/não autenticado)
- Commit `e4698a9`: **Sistema de Toast notifications**
  - Biblioteca sonner integrada
  - Substitui alerts() por toast.success/error
  - Feedback visual melhorado (wishlist)
- Commit `870e7e6`: **Loading skeletons animados**
  - ProductCardSkeleton e CourseCardSkeleton
  - Melhora UX durante carregamento
- Commit `f57f8d3`: **Homepage 100% dinâmica com dados reais** 🎉
  - FeaturedProducts busca 8 produtos reais (ACTIVE, ordenados por rating/sales)
  - FeaturedCourses busca 6 cursos reais (PUBLISHED, ordenados por rating/enrollments)
  - Categories busca categorias principais do banco
  - **BANCO POPULADO**: 50 produtos reais + 10 cursos completos (via SQL no Neon)
  - Scripts de validação: validate-seed.sql, quick-check.sql
- Commit `8edf8c3`: **Correção erro isActive em Categories**
  - Removido filtro `isActive: true` que não existe no schema
  - Adicionado `take: 5` para limitar categorias exibidas
  - Deploy bem-sucedido mas com erros 404 nas imagens

## Próximos Passos
1. **[URGENTE]** Executar `fix-images-placeholder.sql` no Neon para corrigir erro 404 nas imagens
2. Futuramente: Implementar upload de imagens reais via dashboard
3. Considerar sistema de busca global funcional (produtos + cursos)

## Branch Atual
main (deployado automaticamente no Vercel)
