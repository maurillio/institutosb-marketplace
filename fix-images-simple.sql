-- ============================================
-- FIX SIMPLES: Usar placeholder local existente
-- Execute no console Neon AGORA
-- ============================================

-- Atualizar TODOS os produtos para usar o placeholder local
UPDATE "products"
SET images = ARRAY['/placeholder.png'];

-- Atualizar TODOS os cursos para usar o placeholder local
UPDATE "courses"
SET thumbnail = '/placeholder.png';

-- Verificar
SELECT 'Produtos atualizados' as status, COUNT(*) as total FROM "products";
SELECT 'Cursos atualizados' as status, COUNT(*) as total FROM "courses";

-- Mostrar exemplos
SELECT id, name, images FROM "products" LIMIT 3;
SELECT id, title, thumbnail FROM "courses" LIMIT 3;

-- ============================================
-- Após executar, todas as imagens funcionarão
-- sem erro 404. Depois podemos adicionar imagens
-- reais via upload no dashboard.
-- ============================================
