-- ============================================
-- DIAGNÓSTICO COMPLETO DOS CURSOS
-- Execute no console Neon e me envie o resultado
-- ============================================

-- 1. Quantos cursos existem no total?
SELECT 'TOTAL DE CURSOS' as info, COUNT(*) as quantidade
FROM "courses";

-- 2. Cursos por status
SELECT
    'CURSOS POR STATUS' as info,
    status,
    COUNT(*) as quantidade
FROM "courses"
GROUP BY status;

-- 3. Listar TODOS os cursos (id, título, status)
SELECT
    id,
    title,
    status,
    type,
    level,
    thumbnail,
    "instructorId"
FROM "courses"
ORDER BY id;

-- 4. Verificar se existem instrutores válidos
SELECT
    'INSTRUTORES VÁLIDOS' as info,
    COUNT(*) as quantidade
FROM "users"
WHERE 'INSTRUCTOR' = ANY(roles);

-- 5. Cursos com instrutor inexistente
SELECT
    'CURSOS COM INSTRUTOR INVÁLIDO' as info,
    COUNT(*) as quantidade
FROM "courses" c
LEFT JOIN "users" u ON u.id = c."instructorId"
WHERE u.id IS NULL;

-- ============================================
-- Me envie os resultados dessas queries
-- ============================================
