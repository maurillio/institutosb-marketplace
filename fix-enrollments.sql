-- ============================================
-- FIX: Remove enrollments órfãos (sem usuário válido)
-- Execute no console Neon AGORA para corrigir o deploy
-- ============================================

-- 1. Ver quantos enrollments órfãos existem
SELECT COUNT(*) as enrollments_orfaos
FROM "course_enrollments" e
LEFT JOIN "users" u ON u.id = e."userId"
WHERE u.id IS NULL;

-- 2. Deletar enrollments órfãos
DELETE FROM "course_enrollments"
WHERE "userId" NOT IN (SELECT id FROM "users");

-- 3. Verificar (deve retornar 0)
SELECT COUNT(*) as enrollments_orfaos_restantes
FROM "course_enrollments" e
LEFT JOIN "users" u ON u.id = e."userId"
WHERE u.id IS NULL;

-- ============================================
-- Após executar, faça redeploy no Vercel
-- ============================================
