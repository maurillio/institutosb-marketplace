-- ============================================
-- VERIFICAR USUÁRIOS NO BANCO
-- Execute no console Neon e me envie o resultado
-- ============================================

-- 1. Listar todos os usuários
SELECT
    id,
    email,
    name,
    password,
    roles,
    status,
    "emailVerified"
FROM "users"
ORDER BY id;

-- 2. Contar usuários
SELECT 'TOTAL USUÁRIOS' as info, COUNT(*) as total FROM "users";

-- 3. Verificar se o admin existe
SELECT * FROM "users" WHERE email = 'admin@thebeautypro.com';

-- 4. Verificar instrutores
SELECT id, email, name, roles FROM "users" WHERE 'INSTRUCTOR' = ANY(roles);

-- 5. Verificar vendedores
SELECT id, email, name, roles FROM "users" WHERE 'SELLER' = ANY(roles);

-- ============================================
-- Me envie os resultados, especialmente a coluna 'password'
-- para ver se os hashes estão corretos
-- ============================================
