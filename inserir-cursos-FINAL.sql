-- ============================================
-- INSERIR 7 CURSOS FALTANTES - VERSÃO FINAL
-- Usando APENAS campos que existem no schema
-- Execute no console Neon
-- ============================================

INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, thumbnail, duration, status, "publishedAt", rating, "totalEnrollments", "createdAt", "updatedAt")
VALUES ('course-004', 'Skincare Profissional e Tratamentos Faciais', 'skincare-profissional-tratamentos-faciais', 'Aprenda técnicas profissionais de skincare e tratamentos faciais para transformar a pele dos seus clientes.', 'Domine skincare profissional', 'instrutor-004', 'ONLINE', 'BEGINNER', 547.00, '/images/courses/skincare.jpg', 720, 'PUBLISHED', NOW(), 4.6, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, thumbnail, duration, status, "publishedAt", rating, "totalEnrollments", "createdAt", "updatedAt")
VALUES ('course-005', 'Nail Art e Técnicas de Unhas Decoradas', 'nail-art-tecnicas-unhas-decoradas', 'Domine a arte de decoração de unhas e crie designs incríveis para seus clientes.', 'Nail art profissional', 'instrutor-005', 'ONLINE', 'INTERMEDIATE', 447.00, '/images/courses/unhas.jpg', 600, 'PUBLISHED', NOW(), 4.7, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, duration, status, "publishedAt", rating, "totalEnrollments", "createdAt", "updatedAt")
VALUES ('course-006', 'Alongamento e Extensão de Cílios', 'alongamento-extensao-cilios', 'Aprenda técnicas de alongamento e extensão de cílios fio a fio e volume russo.', 'Extensão de cílios', 'instrutor-006', 'HYBRID', 'BEGINNER', 697.00, 997.00, '/images/courses/cilios.jpg', 480, 'PUBLISHED', NOW(), 4.8, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, thumbnail, duration, status, "publishedAt", rating, "totalEnrollments", "createdAt", "updatedAt")
VALUES ('course-007', 'Maquiagem Editorial e para Fotografia', 'maquiagem-editorial-fotografia', 'Aprenda técnicas de maquiagem para editoriais de moda e fotografia profissional.', 'Maquiagem editorial', 'instrutor-001', 'IN_PERSON', 'ADVANCED', 1497.00, '/images/courses/maquiagem.jpg', 960, 'PUBLISHED', NOW(), 4.9, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, thumbnail, duration, status, "publishedAt", rating, "totalEnrollments", "createdAt", "updatedAt")
VALUES ('course-008', 'Corte e Escova Profissional', 'corte-escova-profissional', 'Domine técnicas de corte e escova para todos os tipos de cabelo e estilos.', 'Corte profissional', 'instrutor-002', 'IN_PERSON', 'ALL_LEVELS', 1897.00, '/images/courses/maquiagem.jpg', 2400, 'PUBLISHED', NOW(), 4.7, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, duration, status, "publishedAt", rating, "totalEnrollments", "createdAt", "updatedAt")
VALUES ('course-009', 'Marketing Digital para Profissionais da Beleza', 'marketing-digital-beleza', 'Aprenda a divulgar seus serviços e conquistar clientes através do marketing digital.', 'Marketing digital', 'instrutor-003', 'ONLINE', 'BEGINNER', 297.00, 497.00, '/images/courses/marketing.jpg', 480, 'PUBLISHED', NOW(), 4.5, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, duration, status, "publishedAt", rating, "totalEnrollments", "createdAt", "updatedAt")
VALUES ('course-010', 'Gestão e Empreendedorismo em Salão de Beleza', 'gestao-empreendedorismo-salao', 'Aprenda a gerenciar seu salão de beleza e transformá-lo em um negócio lucrativo.', 'Gestão de salão', 'instrutor-004', 'ONLINE', 'ALL_LEVELS', 697.00, 997.00, '/images/courses/empreendedorismo.jpg', 1200, 'PUBLISHED', NOW(), 4.8, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

-- Verificar
SELECT 'TOTAL DE CURSOS' as info, COUNT(*) as total FROM "courses";
SELECT id, title, status, thumbnail FROM "courses" ORDER BY id;

-- ============================================
-- RESULTADO: 10 cursos PUBLISHED
-- ============================================
