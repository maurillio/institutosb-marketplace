-- ============================================
-- VERIFICAÇÃO RÁPIDA - Copie e cole no console Neon
-- ============================================

-- Contagem geral
SELECT
  'CONTAGENS' as tipo,
  (SELECT COUNT(*) FROM "users") as usuarios,
  (SELECT COUNT(*) FROM "products") as produtos,
  (SELECT COUNT(*) FROM "courses") as cursos
UNION ALL
SELECT
  'ESPERADO' as tipo,
  17 as usuarios,
  50 as produtos,
  10 as cursos;

-- Verificar se há problemas de integridade
SELECT
  CASE
    WHEN (
      (SELECT COUNT(*) FROM "products" p LEFT JOIN "users" u ON u.id = p."sellerId" WHERE u.id IS NULL) = 0
      AND (SELECT COUNT(*) FROM "courses" c LEFT JOIN "users" u ON u.id = c."instructorId" WHERE u.id IS NULL) = 0
      AND (SELECT COUNT(*) FROM "course_modules" m LEFT JOIN "courses" c ON c.id = m."courseId" WHERE c.id IS NULL) = 0
      AND (SELECT COUNT(*) FROM "course_lessons" l LEFT JOIN "course_modules" m ON m.id = l."moduleId" WHERE m.id IS NULL) = 0
    )
    THEN '✅ TUDO OK - Banco populado com sucesso!'
    ELSE '❌ ERRO - Há problemas de integridade'
  END as status;
