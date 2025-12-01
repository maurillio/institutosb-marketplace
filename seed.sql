-- ============================================
-- SEED DATA PARA THE BEAUTY PRO MARKETPLACE
-- Execute APÓS create-tables.sql
-- ============================================

-- OBS: Se você executou create-tables.sql, as tabelas já estão vazias.
-- Se precisar limpar dados existentes, descomente as linhas abaixo:
-- DELETE FROM "course_lessons";
-- DELETE FROM "course_modules";
-- DELETE FROM "products";
-- DELETE FROM "courses";
-- DELETE FROM "categories";
-- DELETE FROM "instructor_profiles";
-- DELETE FROM "seller_profiles";
-- DELETE FROM "users";

-- ============================================
-- 1. CRIAR USUÁRIOS
-- ============================================
-- Senha hasheada de "senha123" (bcrypt)
-- $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW

-- Admin
INSERT INTO "users" (id, email, name, password, "emailVerified", roles, status, "createdAt", "updatedAt")
VALUES
('admin-001', 'admin@thebeautypro.com', 'Admin The Beauty Pro', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['ADMIN', 'SELLER', 'INSTRUCTOR']::"UserRole"[], 'ACTIVE', NOW(), NOW());

-- 10 Vendedores
INSERT INTO "users" (id, email, name, password, "emailVerified", roles, status, avatar, "createdAt", "updatedAt")
VALUES
('vendedor-001', 'vendedor1@thebeautypro.com', 'Maria Silva', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-1.jpg', NOW(), NOW()),
('vendedor-002', 'vendedor2@thebeautypro.com', 'João Santos', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-2.jpg', NOW(), NOW()),
('vendedor-003', 'vendedor3@thebeautypro.com', 'Ana Costa', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-3.jpg', NOW(), NOW()),
('vendedor-004', 'vendedor4@thebeautypro.com', 'Pedro Oliveira', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-4.jpg', NOW(), NOW()),
('vendedor-005', 'vendedor5@thebeautypro.com', 'Juliana Souza', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-5.jpg', NOW(), NOW()),
('vendedor-006', 'vendedor6@thebeautypro.com', 'Carlos Ferreira', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-6.jpg', NOW(), NOW()),
('vendedor-007', 'vendedor7@thebeautypro.com', 'Fernanda Lima', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-7.jpg', NOW(), NOW()),
('vendedor-008', 'vendedor8@thebeautypro.com', 'Ricardo Alves', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-8.jpg', NOW(), NOW()),
('vendedor-009', 'vendedor9@thebeautypro.com', 'Patrícia Rocha', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-9.jpg', NOW(), NOW()),
('vendedor-010', 'vendedor10@thebeautypro.com', 'Lucas Martins', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'SELLER']::"UserRole"[], 'ACTIVE', '/images/avatars/seller-10.jpg', NOW(), NOW());

-- 6 Instrutores
INSERT INTO "users" (id, email, name, password, "emailVerified", roles, status, avatar, "createdAt", "updatedAt")
VALUES
('instrutor-001', 'instrutor1@thebeautypro.com', 'Carla Mendes', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'INSTRUCTOR']::"UserRole"[], 'ACTIVE', '/images/avatars/instructor-1.jpg', NOW(), NOW()),
('instrutor-002', 'instrutor2@thebeautypro.com', 'Roberto Silva', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'INSTRUCTOR']::"UserRole"[], 'ACTIVE', '/images/avatars/instructor-2.jpg', NOW(), NOW()),
('instrutor-003', 'instrutor3@thebeautypro.com', 'Juliana Santos', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'INSTRUCTOR']::"UserRole"[], 'ACTIVE', '/images/avatars/instructor-3.jpg', NOW(), NOW()),
('instrutor-004', 'instrutor4@thebeautypro.com', 'Fernando Costa', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'INSTRUCTOR']::"UserRole"[], 'ACTIVE', '/images/avatars/instructor-4.jpg', NOW(), NOW()),
('instrutor-005', 'instrutor5@thebeautypro.com', 'Amanda Oliveira', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'INSTRUCTOR']::"UserRole"[], 'ACTIVE', '/images/avatars/instructor-5.jpg', NOW(), NOW()),
('instrutor-006', 'instrutor6@thebeautypro.com', 'Paulo Ribeiro', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NOW(), ARRAY['CUSTOMER', 'INSTRUCTOR']::"UserRole"[], 'ACTIVE', '/images/avatars/instructor-6.jpg', NOW(), NOW());

-- ============================================
-- 2. CRIAR PERFIS DE VENDEDORES
-- ============================================
INSERT INTO "seller_profiles" (id, "userId", "storeName", "storeSlug", description, plan, rating, "createdAt", "updatedAt")
VALUES
('seller-profile-001', 'vendedor-001', 'Beleza Premium', 'loja-1', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'PRO', 4.8, NOW(), NOW()),
('seller-profile-002', 'vendedor-002', 'Professional Beauty', 'loja-2', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'PRO', 4.6, NOW(), NOW()),
('seller-profile-003', 'vendedor-003', 'Studio Glamour', 'loja-3', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'PRO', 4.9, NOW(), NOW()),
('seller-profile-004', 'vendedor-004', 'Beauty Express', 'loja-4', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'PRO', 4.7, NOW(), NOW()),
('seller-profile-005', 'vendedor-005', 'Espaço Beleza', 'loja-5', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'PRO', 4.5, NOW(), NOW()),
('seller-profile-006', 'vendedor-006', 'Elegance Beauty', 'loja-6', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'BASIC', 4.4, NOW(), NOW()),
('seller-profile-007', 'vendedor-007', 'Charme & Estilo', 'loja-7', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'BASIC', 4.6, NOW(), NOW()),
('seller-profile-008', 'vendedor-008', 'Beauty Market', 'loja-8', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'BASIC', 4.3, NOW(), NOW()),
('seller-profile-009', 'vendedor-009', 'Glamour Store', 'loja-9', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'BASIC', 4.7, NOW(), NOW()),
('seller-profile-010', 'vendedor-010', 'Pro Beauty Shop', 'loja-10', 'Produtos profissionais de qualidade para salões e profissionais da beleza', 'BASIC', 4.5, NOW(), NOW());

-- ============================================
-- 3. CRIAR PERFIS DE INSTRUTORES
-- ============================================
INSERT INTO "instructor_profiles" (id, "userId", bio, expertise, rating, "createdAt", "updatedAt")
VALUES
('instructor-profile-001', 'instrutor-001', 'Especialista em beleza profissional com mais de 7 anos de experiência. Já capacitou mais de 100 profissionais.', ARRAY['Maquiagem Profissional', 'Técnicas Avançadas', 'Educação Continuada']::TEXT[], 4.7, NOW(), NOW()),
('instructor-profile-002', 'instrutor-002', 'Especialista em beleza profissional com mais de 9 anos de experiência. Já capacitou mais de 200 profissionais.', ARRAY['Maquiagem Profissional', 'Técnicas Avançadas', 'Educação Continuada']::TEXT[], 4.8, NOW(), NOW()),
('instructor-profile-003', 'instrutor-003', 'Especialista em beleza profissional com mais de 11 anos de experiência. Já capacitou mais de 300 profissionais.', ARRAY['Maquiagem Profissional', 'Técnicas Avançadas', 'Educação Continuada']::TEXT[], 4.9, NOW(), NOW()),
('instructor-profile-004', 'instrutor-004', 'Especialista em beleza profissional com mais de 13 anos de experiência. Já capacitou mais de 400 profissionais.', ARRAY['Maquiagem Profissional', 'Técnicas Avançadas', 'Educação Continuada']::TEXT[], 4.6, NOW(), NOW()),
('instructor-profile-005', 'instrutor-005', 'Especialista em beleza profissional com mais de 15 anos de experiência. Já capacitou mais de 500 profissionais.', ARRAY['Maquiagem Profissional', 'Técnicas Avançadas', 'Educação Continuada']::TEXT[], 4.8, NOW(), NOW()),
('instructor-profile-006', 'instrutor-006', 'Especialista em beleza profissional com mais de 17 anos de experiência. Já capacitou mais de 600 profissionais.', ARRAY['Maquiagem Profissional', 'Técnicas Avançadas', 'Educação Continuada']::TEXT[], 4.7, NOW(), NOW());

-- ============================================
-- 4. CRIAR CATEGORIAS
-- ============================================
-- Categorias principais
INSERT INTO "categories" (id, name, slug, description, icon, "imageUrl", "createdAt", "updatedAt")
VALUES
('cat-maquiagem', 'Maquiagem', 'maquiagem', 'Produtos profissionais de maquiagem para salões e profissionais da beleza', 'Paintbrush', '/images/categories/maquiagem.jpg', NOW(), NOW()),
('cat-cabelo', 'Cabelo', 'cabelo', 'Tratamentos e finalizadores capilares profissionais', 'Scissors', '/images/categories/cabelo.jpg', NOW(), NOW()),
('cat-skincare', 'Skincare', 'skincare', 'Cuidados profissionais com a pele e tratamentos faciais', 'Heart', '/images/categories/skincare.jpg', NOW(), NOW()),
('cat-unhas', 'Unhas', 'unhas', 'Produtos profissionais para manicure e pedicure', 'Sparkles', '/images/categories/unhas.jpg', NOW(), NOW()),
('cat-equipamentos', 'Equipamentos', 'equipamentos', 'Equipamentos profissionais para salão de beleza', 'Zap', '/images/categories/equipamentos.jpg', NOW(), NOW());

-- Subcategorias de Maquiagem
INSERT INTO "categories" (id, name, slug, description, "parentId", "createdAt", "updatedAt")
VALUES
('cat-bases-corretivos', 'Bases e Corretivos', 'bases-corretivos', 'Bases líquidas, cremosas, corretivos e primers para pele perfeita', 'cat-maquiagem', NOW(), NOW()),
('cat-sombras-paletas', 'Sombras e Paletas', 'sombras-paletas', 'Paletas de sombras, iluminadores e produtos para olhos', 'cat-maquiagem', NOW(), NOW()),
('cat-batons-glosses', 'Batons e Glosses', 'batons-glosses', 'Batons líquidos, cremosos, glosses e produtos para lábios', 'cat-maquiagem', NOW(), NOW()),
('cat-pinceis-ferramentas', 'Pincéis e Ferramentas', 'pinceis-ferramentas', 'Pincéis profissionais, esponjas e ferramentas de aplicação', 'cat-maquiagem', NOW(), NOW()),
('cat-primers-fixadores', 'Primers e Fixadores', 'primers-fixadores', 'Primers faciais, fixadores de maquiagem e finalizadores', 'cat-maquiagem', NOW(), NOW());

-- Subcategorias de Cabelo
INSERT INTO "categories" (id, name, slug, description, "parentId", "createdAt", "updatedAt")
VALUES
('cat-shampoos', 'Shampoos Profissionais', 'shampoos', 'Shampoos de tratamento para uso profissional em salões', 'cat-cabelo', NOW(), NOW()),
('cat-condicionadores', 'Condicionadores e Máscaras', 'condicionadores', 'Condicionadores, máscaras reconstrutoras e hidratantes intensivos', 'cat-cabelo', NOW(), NOW()),
('cat-tratamentos-capilares', 'Tratamentos Especiais', 'tratamentos-capilares', 'Ampolas, cremes de tratamento e terapias capilares', 'cat-cabelo', NOW(), NOW()),
('cat-finalizadores', 'Finalizadores', 'finalizadores', 'Sprays, óleos, séruns e produtos de finalização', 'cat-cabelo', NOW(), NOW()),
('cat-coloracao', 'Coloração', 'coloracao', 'Tinturas profissionais, descolorantes e tonalizantes', 'cat-cabelo', NOW(), NOW());

-- Subcategorias de Skincare
INSERT INTO "categories" (id, name, slug, description, "parentId", "createdAt", "updatedAt")
VALUES
('cat-limpeza-facial', 'Limpeza Facial', 'limpeza-facial', 'Sabonetes, géis de limpeza, demaquilantes e tônicos', 'cat-skincare', NOW(), NOW()),
('cat-hidratantes', 'Hidratantes', 'hidratantes', 'Cremes hidratantes faciais e corporais profissionais', 'cat-skincare', NOW(), NOW()),
('cat-serums', 'Séruns e Tratamentos', 'serums', 'Séruns concentrados, ácidos e tratamentos intensivos', 'cat-skincare', NOW(), NOW()),
('cat-protecao-solar', 'Proteção Solar', 'protecao-solar', 'Protetores solares faciais e corporais de alta proteção', 'cat-skincare', NOW(), NOW()),
('cat-mascaras-faciais', 'Máscaras Faciais', 'mascaras-faciais', 'Máscaras de argila, sheet masks e tratamentos faciais', 'cat-skincare', NOW(), NOW());

-- Subcategorias de Unhas
INSERT INTO "categories" (id, name, slug, description, "parentId", "createdAt", "updatedAt")
VALUES
('cat-esmaltes', 'Esmaltes Profissionais', 'esmaltes', 'Esmaltes de alta qualidade para uso profissional', 'cat-unhas', NOW(), NOW()),
('cat-gel-uv', 'Gel UV/LED', 'gel-uv', 'Esmaltes em gel, top coats e bases para unhas em gel', 'cat-unhas', NOW(), NOW()),
('cat-ferramentas-unhas', 'Ferramentas e Acessórios', 'ferramentas-unhas', 'Alicates, lixas, espátulas e ferramentas profissionais', 'cat-unhas', NOW(), NOW()),
('cat-tratamentos-unhas', 'Tratamentos', 'tratamentos-unhas', 'Fortalecedores, óleos de cutícula e tratamentos para unhas', 'cat-unhas', NOW(), NOW()),
('cat-nail-art', 'Nail Art', 'nail-art', 'Adesivos, glitters, carimbo e produtos para decoração', 'cat-unhas', NOW(), NOW());

-- Subcategorias de Equipamentos
INSERT INTO "categories" (id, name, slug, description, "parentId", "createdAt", "updatedAt")
VALUES
('cat-secadores', 'Secadores e Modeladores', 'secadores', 'Secadores profissionais, difusores e escovas modeladoras', 'cat-equipamentos', NOW(), NOW()),
('cat-chapinhas', 'Chapinhas e Babyliss', 'chapinhas', 'Chapinhas, babyliss e modeladores profissionais', 'cat-equipamentos', NOW(), NOW()),
('cat-cabines-uv', 'Cabines UV/LED', 'cabines-uv', 'Cabines de LED e UV para unhas em gel', 'cat-equipamentos', NOW(), NOW()),
('cat-vaporizadores', 'Vaporizadores', 'vaporizadores', 'Vaporizadores faciais e equipamentos de tratamento', 'cat-equipamentos', NOW(), NOW()),
('cat-mobiliario', 'Mobiliário', 'mobiliario', 'Cadeiras, macas, carrinhos e mobiliário para salão', 'cat-equipamentos', NOW(), NOW());

-- ============================================
-- OBSERVAÇÃO: Produtos e Cursos
-- ============================================
-- Devido ao tamanho extenso (50 produtos + 10 cursos com módulos/aulas),
-- os INSERTs estão divididos em arquivos separados:
-- - seed-products.sql (50 produtos completos)
-- - seed-courses.sql (10 cursos com módulos e aulas)
--
-- Execute os scripts na seguinte ordem:
-- 1. seed.sql (este arquivo - usuários, categorias)
-- 2. seed-products.sql (produtos)
-- 3. seed-courses.sql (cursos)
--
-- OU execute o arquivo consolidado: seed-complete.sql

-- ============================================
-- CREDENCIAIS DE ACESSO
-- ============================================
-- Email: admin@thebeautypro.com | Senha: senha123
-- Email: vendedor1@thebeautypro.com | Senha: senha123
-- Email: instrutor1@thebeautypro.com | Senha: senha123
