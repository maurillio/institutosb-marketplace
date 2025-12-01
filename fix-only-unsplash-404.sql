-- ============================================
-- CORRIGIR APENAS PRODUTOS COM IMAGENS 404 DO UNSPLASH
-- Execute no console Neon
-- ============================================

-- Atualizar produtos que têm URLs do Unsplash (estão dando 404)
UPDATE "products"
SET images = ARRAY['/placeholder.png']
WHERE images::text LIKE '%unsplash%';

-- Atualizar cursos que têm URLs do Unsplash (estão dando 404)
UPDATE "courses"
SET thumbnail = '/placeholder.png'
WHERE thumbnail LIKE '%unsplash%';

-- Verificar quantos foram atualizados
SELECT
    'Produtos com placeholder' as tipo,
    COUNT(*) as total
FROM "products"
WHERE images = ARRAY['/placeholder.png'];

SELECT
    'Cursos com placeholder' as tipo,
    COUNT(*) as total
FROM "courses"
WHERE thumbnail = '/placeholder.png';

-- Mostrar os produtos específicos que foram corrigidos
SELECT id, name, images
FROM "products"
WHERE id IN ('prod-040', 'prod-024', 'prod-002', 'prod-008', 'prod-041')
ORDER BY id;

-- ============================================
-- Resultado: Todos os erros 404 serão eliminados
-- ============================================
