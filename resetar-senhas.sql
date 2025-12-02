-- ============================================
-- RESETAR TODAS AS SENHAS PARA: password123
-- Execute no console Neon APENAS SE NECESSÁRIO
-- ============================================

-- Hash bcrypt válido para a senha "password123"
-- $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW

-- Atualizar TODOS os usuários com a senha "password123"
UPDATE "users"
SET password = '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW';

-- Verificar
SELECT id, email, LEFT(password, 20) as password_hash FROM "users" LIMIT 5;

-- ============================================
-- Após executar, tente fazer login com:
-- Email: qualquer email dos usuários
-- Senha: password123
-- ============================================
