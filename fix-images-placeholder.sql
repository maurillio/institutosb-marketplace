-- ============================================
-- FIX: Atualizar imagens para usar placeholder temporário
-- Execute no console Neon para corrigir erro 404 nas imagens
-- ============================================

-- 1. Atualizar imagens de produtos para usar placeholder
UPDATE "products"
SET images = ARRAY['/placeholder.png']
WHERE images IS NOT NULL;

-- 2. Atualizar thumbnail dos cursos para usar placeholder
UPDATE "courses"
SET thumbnail = '/placeholder.png'
WHERE thumbnail IS NOT NULL OR thumbnail = '';

-- 3. Verificar produtos atualizados
SELECT id, name, images FROM "products" LIMIT 5;

-- 4. Verificar cursos atualizados
SELECT id, title, thumbnail FROM "courses" LIMIT 5;

-- ============================================
-- Após executar, o site não terá mais erros 404 nas imagens
-- Quando tiver imagens reais, rode um UPDATE específico
-- ============================================
