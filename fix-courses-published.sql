-- ============================================
-- CORRIGIR STATUS E IMAGENS DOS CURSOS
-- Execute no console Neon
-- ============================================

-- 1. Ver quantos cursos existem e seus status
SELECT status, COUNT(*) as total
FROM "courses"
GROUP BY status;

-- 2. Atualizar TODOS os cursos para PUBLISHED
UPDATE "courses"
SET status = 'PUBLISHED',
    "publishedAt" = COALESCE("publishedAt", NOW())
WHERE status != 'PUBLISHED' OR "publishedAt" IS NULL;

-- 3. Atualizar thumbnails dos cursos (já executamos antes, mas garantir)
UPDATE "courses" SET thumbnail = '/images/courses/maquiagem.jpg' WHERE title LIKE '%Maquiagem%';
UPDATE "courses" SET thumbnail = '/images/courses/colorimetria.jpg' WHERE title LIKE '%Colorimetria%';
UPDATE "courses" SET thumbnail = '/images/courses/sobrancelhas.jpg' WHERE title LIKE '%Sobrancelha%';
UPDATE "courses" SET thumbnail = '/images/courses/unhas.jpg' WHERE title LIKE '%Unha%' OR title LIKE '%Nail%';
UPDATE "courses" SET thumbnail = '/images/courses/skincare.jpg' WHERE title LIKE '%Skincare%' OR title LIKE '%Pele%';
UPDATE "courses" SET thumbnail = '/images/courses/cilios.jpg' WHERE title LIKE '%Cílio%' OR title LIKE '%Extensão%' OR title LIKE '%Alongamento%';
UPDATE "courses" SET thumbnail = '/images/courses/massagem.jpg' WHERE title LIKE '%Massagem%';
UPDATE "courses" SET thumbnail = '/images/courses/empreendedorismo.jpg' WHERE title LIKE '%Empreend%' OR title LIKE '%Gestão%' OR title LIKE '%Negócio%';
UPDATE "courses" SET thumbnail = '/images/courses/marketing.jpg' WHERE title LIKE '%Marketing%' OR title LIKE '%Instagram%';
UPDATE "courses" SET thumbnail = '/images/courses/automaquiagem.jpg' WHERE title LIKE '%Automaquiagem%';
UPDATE "courses" SET thumbnail = '/images/courses/maquiagem.jpg' WHERE title LIKE '%Corte%' OR title LIKE '%Escova%';
UPDATE "courses" SET thumbnail = '/images/courses/maquiagem.jpg' WHERE title LIKE '%Editorial%';

-- Cursos sem match específico
UPDATE "courses" SET thumbnail = '/images/courses/maquiagem.jpg'
WHERE thumbnail NOT LIKE '/images/courses/%' OR thumbnail IS NULL;

-- 4. Verificar resultado
SELECT
    'CURSOS PUBLISHED' as info,
    COUNT(*) as total
FROM "courses"
WHERE status = 'PUBLISHED';

-- 5. Listar todos os cursos
SELECT
    id,
    title,
    status,
    thumbnail,
    "publishedAt"
FROM "courses"
ORDER BY "createdAt";

-- ============================================
-- RESULTADO ESPERADO: 10 cursos PUBLISHED
-- ============================================
