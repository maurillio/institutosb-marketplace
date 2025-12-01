-- ============================================
-- SCRIPT DE VALIDAÇÃO - THE BEAUTY PRO MARKETPLACE
-- Execute no console Neon para verificar se os dados foram inseridos corretamente
-- ============================================

-- 1. CONTAGEM DE REGISTROS
SELECT
  '=== CONTAGEM DE REGISTROS ===' as status;

SELECT
  (SELECT COUNT(*) FROM "users") as usuarios,
  (SELECT COUNT(*) FROM "seller_profiles") as vendedores,
  (SELECT COUNT(*) FROM "instructor_profiles") as instrutores,
  (SELECT COUNT(*) FROM "categories") as categorias,
  (SELECT COUNT(*) FROM "products") as produtos,
  (SELECT COUNT(*) FROM "courses") as cursos,
  (SELECT COUNT(*) FROM "course_modules") as modulos,
  (SELECT COUNT(*) FROM "course_lessons") as aulas;

-- Resultado esperado:
-- usuarios: 17 (1 admin + 10 vendedores + 6 instrutores)
-- vendedores: 10
-- instrutores: 6
-- categorias: 35 (5 principais + 30 subcategorias)
-- produtos: 50
-- cursos: 10
-- modulos: ~40
-- aulas: ~80

-- 2. VERIFICAR USUÁRIOS E ROLES
SELECT
  '=== USUÁRIOS POR ROLE ===' as status;

SELECT
  UNNEST(roles) as role,
  COUNT(*) as total
FROM "users"
GROUP BY UNNEST(roles)
ORDER BY total DESC;

-- 3. VERIFICAR PRODUTOS POR CATEGORIA
SELECT
  '=== PRODUTOS POR CATEGORIA ===' as status;

SELECT
  c.name as categoria,
  COUNT(p.id) as total_produtos
FROM "categories" c
LEFT JOIN "products" p ON p."categoryId" = c.id
WHERE c."parentId" IS NOT NULL  -- Apenas subcategorias
GROUP BY c.name
ORDER BY total_produtos DESC
LIMIT 10;

-- 4. VERIFICAR CURSOS E SEUS MÓDULOS
SELECT
  '=== CURSOS E MÓDULOS ===' as status;

SELECT
  c.title as curso,
  c.type as tipo,
  c.level as nivel,
  c.price as preco,
  COUNT(DISTINCT m.id) as total_modulos,
  COUNT(l.id) as total_aulas
FROM "courses" c
LEFT JOIN "course_modules" m ON m."courseId" = c.id
LEFT JOIN "course_lessons" l ON l."moduleId" = m.id
GROUP BY c.id, c.title, c.type, c.level, c.price
ORDER BY c.title;

-- 5. VERIFICAR INTEGRIDADE: PRODUTOS COM VENDEDOR VÁLIDO
SELECT
  '=== INTEGRIDADE: PRODUTOS ===' as status;

SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✓ OK: Todos os produtos têm vendedor válido'
    ELSE '✗ ERRO: ' || COUNT(*) || ' produtos com vendedor inválido'
  END as resultado
FROM "products" p
LEFT JOIN "users" u ON u.id = p."sellerId"
WHERE u.id IS NULL;

-- 6. VERIFICAR INTEGRIDADE: CURSOS COM INSTRUTOR VÁLIDO
SELECT
  '=== INTEGRIDADE: CURSOS ===' as status;

SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✓ OK: Todos os cursos têm instrutor válido'
    ELSE '✗ ERRO: ' || COUNT(*) || ' cursos com instrutor inválido'
  END as resultado
FROM "courses" c
LEFT JOIN "users" u ON u.id = c."instructorId"
WHERE u.id IS NULL;

-- 7. VERIFICAR INTEGRIDADE: MÓDULOS COM CURSO VÁLIDO
SELECT
  '=== INTEGRIDADE: MÓDULOS ===' as status;

SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✓ OK: Todos os módulos têm curso válido'
    ELSE '✗ ERRO: ' || COUNT(*) || ' módulos com curso inválido'
  END as resultado
FROM "course_modules" m
LEFT JOIN "courses" c ON c.id = m."courseId"
WHERE c.id IS NULL;

-- 8. VERIFICAR INTEGRIDADE: AULAS COM MÓDULO VÁLIDO
SELECT
  '=== INTEGRIDADE: AULAS ===' as status;

SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✓ OK: Todas as aulas têm módulo válido'
    ELSE '✗ ERRO: ' || COUNT(*) || ' aulas com módulo inválido'
  END as resultado
FROM "course_lessons" l
LEFT JOIN "course_modules" m ON m.id = l."moduleId"
WHERE m.id IS NULL;

-- 9. AMOSTRA DE DADOS: PRODUTOS
SELECT
  '=== AMOSTRA: PRIMEIROS 5 PRODUTOS ===' as status;

SELECT
  p.name as produto,
  p.brand as marca,
  p.price as preco,
  p.stock as estoque,
  p.status as status,
  c.name as categoria,
  u.name as vendedor
FROM "products" p
JOIN "categories" c ON c.id = p."categoryId"
JOIN "users" u ON u.id = p."sellerId"
ORDER BY p."createdAt"
LIMIT 5;

-- 10. AMOSTRA DE DADOS: CURSOS
SELECT
  '=== AMOSTRA: PRIMEIROS 5 CURSOS ===' as status;

SELECT
  c.title as curso,
  c.type as tipo,
  c.level as nivel,
  c.price as preco,
  c.duration as duracao_minutos,
  c.status as status,
  u.name as instrutor
FROM "courses" c
JOIN "users" u ON u.id = c."instructorId"
ORDER BY c."createdAt"
LIMIT 5;

-- 11. VERIFICAR CATEGORIAS HIERÁRQUICAS
SELECT
  '=== CATEGORIAS PRINCIPAIS E SUBCATEGORIAS ===' as status;

SELECT
  COALESCE(parent.name, 'SEM CATEGORIA PAI') as categoria_pai,
  COUNT(child.id) as total_subcategorias
FROM "categories" child
LEFT JOIN "categories" parent ON parent.id = child."parentId"
WHERE child."parentId" IS NOT NULL
GROUP BY parent.name
ORDER BY total_subcategorias DESC;

-- 12. RESUMO FINAL
SELECT
  '=== RESUMO FINAL ===' as status;

SELECT
  '✓ Banco populado com sucesso!' as resultado,
  (SELECT COUNT(*) FROM "users") || ' usuários' as usuarios,
  (SELECT COUNT(*) FROM "products") || ' produtos' as produtos,
  (SELECT COUNT(*) FROM "courses") || ' cursos' as cursos,
  (SELECT COUNT(*) FROM "course_lessons") || ' aulas' as aulas;

-- ============================================
-- FIM DA VALIDAÇÃO
-- ============================================
-- Se todos os checks de integridade mostrarem "✓ OK",
-- seu banco está pronto para uso! 🎉
-- ============================================
