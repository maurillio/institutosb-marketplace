-- ============================================
-- INSERIR OS 7 CURSOS FALTANTES
-- Execute no console Neon APÓS o diagnóstico
-- ============================================

-- Deletar cursos duplicados ou problemáticos primeiro (se necessário)
-- DELETE FROM "courses" WHERE id NOT IN ('course-001', 'course-002', 'course-003');

-- Inserir curso 4 - Skincare
INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, "previewVideo", duration, "maxStudents", certificate, status, "publishedAt", rating, "totalReviews", "totalEnrollments", "createdAt", "updatedAt")
VALUES
('course-004', 'Skincare Profissional e Tratamentos Faciais', 'skincare-profissional-tratamentos-faciais',
'Aprenda técnicas profissionais de skincare e tratamentos faciais para transformar a pele dos seus clientes.',
'Domine técnicas de skincare profissional',
'instrutor-004', 'ONLINE', 'BEGINNER', 547.00, NULL, '/images/courses/skincare.jpg', NULL, 720, NULL, TRUE, 'PUBLISHED',
NOW(), 4.6, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    status = 'PUBLISHED',
    thumbnail = '/images/courses/skincare.jpg',
    "publishedAt" = COALESCE("courses"."publishedAt", NOW());

-- Inserir curso 5 - Nail Art
INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, "previewVideo", duration, "maxStudents", certificate, status, "publishedAt", rating, "totalReviews", "totalEnrollments", "createdAt", "updatedAt")
VALUES
('course-005', 'Nail Art e Técnicas de Unhas Decoradas', 'nail-art-tecnicas-unhas-decoradas',
'Domine a arte de decoração de unhas e crie designs incríveis para seus clientes.',
'Aprenda técnicas de nail art profissional',
'instrutor-005', 'ONLINE', 'INTERMEDIATE', 447.00, NULL, '/images/courses/unhas.jpg', NULL, 600, NULL, TRUE, 'PUBLISHED',
NOW(), 4.7, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    status = 'PUBLISHED',
    thumbnail = '/images/courses/unhas.jpg',
    "publishedAt" = COALESCE("courses"."publishedAt", NOW());

-- Inserir curso 6 - Alongamento de Cílios
INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, "previewVideo", duration, "maxStudents", certificate, status, "publishedAt", rating, "totalReviews", "totalEnrollments", "createdAt", "updatedAt")
VALUES
('course-006', 'Alongamento e Extensão de Cílios', 'alongamento-extensao-cilios',
'Aprenda técnicas de alongamento e extensão de cílios fio a fio e volume russo.',
'Domine técnicas de extensão de cílios',
'instrutor-006', 'HYBRID', 'BEGINNER', 697.00, 997.00, '/images/courses/cilios.jpg', NULL, 480, NULL, TRUE, 'PUBLISHED',
NOW(), 4.8, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    status = 'PUBLISHED',
    thumbnail = '/images/courses/cilios.jpg',
    "publishedAt" = COALESCE("courses"."publishedAt", NOW());

-- Inserir curso 7 - Maquiagem Editorial
INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, "previewVideo", duration, "maxStudents", certificate, status, "publishedAt", rating, "totalReviews", "totalEnrollments", "createdAt", "updatedAt")
VALUES
('course-007', 'Maquiagem Editorial e para Fotografia', 'maquiagem-editorial-fotografia',
'Aprenda técnicas de maquiagem para editoriais de moda e fotografia profissional.',
'Maquiagem para editorial e fotografia',
'instrutor-001', 'IN_PERSON', 'ADVANCED', 1497.00, NULL, '/images/courses/maquiagem.jpg', NULL, 960, NULL, TRUE, 'PUBLISHED',
NOW(), 4.9, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    status = 'PUBLISHED',
    thumbnail = '/images/courses/maquiagem.jpg',
    "publishedAt" = COALESCE("courses"."publishedAt", NOW());

-- Inserir curso 8 - Corte e Escova
INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, "previewVideo", duration, "maxStudents", certificate, status, "publishedAt", rating, "totalReviews", "totalEnrollments", "createdAt", "updatedAt")
VALUES
('course-008', 'Corte e Escova Profissional', 'corte-escova-profissional',
'Domine técnicas de corte e escova para todos os tipos de cabelo e estilos.',
'Técnicas profissionais de corte e escova',
'instrutor-002', 'IN_PERSON', 'ALL_LEVELS', 1897.00, NULL, '/images/courses/maquiagem.jpg', NULL, 2400, NULL, TRUE, 'PUBLISHED',
NOW(), 4.7, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    status = 'PUBLISHED',
    thumbnail = '/images/courses/maquiagem.jpg',
    "publishedAt" = COALESCE("courses"."publishedAt", NOW());

-- Inserir curso 9 - Marketing Digital
INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, "previewVideo", duration, "maxStudents", certificate, status, "publishedAt", rating, "totalReviews", "totalEnrollments", "createdAt", "updatedAt")
VALUES
('course-009', 'Marketing Digital para Profissionais da Beleza', 'marketing-digital-beleza',
'Aprenda a divulgar seus serviços e conquistar clientes através do marketing digital.',
'Marketing digital para o mercado da beleza',
'instrutor-003', 'ONLINE', 'BEGINNER', 297.00, 497.00, '/images/courses/marketing.jpg', NULL, 480, NULL, TRUE, 'PUBLISHED',
NOW(), 4.5, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    status = 'PUBLISHED',
    thumbnail = '/images/courses/marketing.jpg',
    "publishedAt" = COALESCE("courses"."publishedAt", NOW());

-- Inserir curso 10 - Gestão de Salão
INSERT INTO "courses" (id, title, slug, description, "shortDescription", "instructorId", type, level, price, "compareAtPrice", thumbnail, "previewVideo", duration, "maxStudents", certificate, status, "publishedAt", rating, "totalReviews", "totalEnrollments", "createdAt", "updatedAt")
VALUES
('course-010', 'Gestão e Empreendedorismo em Salão de Beleza', 'gestao-empreendedorismo-salao',
'Aprenda a gerenciar seu salão de beleza e transformá-lo em um negócio lucrativo.',
'Gestão completa de salão de beleza',
'instrutor-004', 'ONLINE', 'ALL_LEVELS', 697.00, 997.00, '/images/courses/empreendedorismo.jpg', NULL, 1200, NULL, TRUE, 'PUBLISHED',
NOW(), 4.8, 0, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    status = 'PUBLISHED',
    thumbnail = '/images/courses/empreendedorismo.jpg',
    "publishedAt" = COALESCE("courses"."publishedAt", NOW());

-- Verificar resultado
SELECT 'CURSOS APÓS INSERÇÃO' as info, COUNT(*) as total
FROM "courses"
WHERE status = 'PUBLISHED';

-- Listar todos
SELECT id, title, status, thumbnail
FROM "courses"
ORDER BY id;

-- ============================================
-- RESULTADO ESPERADO: 10 cursos
-- ============================================
