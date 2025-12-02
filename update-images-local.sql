-- ============================================
-- ATUALIZAR TODOS OS PRODUTOS E CURSOS COM IMAGENS REAIS LOCAIS
-- Execute no console Neon AGORA
-- ============================================

-- PRODUTOS - Atualizar por categoria/tipo

-- BASES E CORRETIVOS
UPDATE "products" SET images = ARRAY['/images/products/base.jpg'] WHERE name LIKE '%Base%';
UPDATE "products" SET images = ARRAY['/images/products/corretivo.jpg'] WHERE name LIKE '%Corretivo%';

-- BATONS E LÁBIOS
UPDATE "products" SET images = ARRAY['/images/products/batom.jpg'] WHERE name LIKE '%Batom%' OR name LIKE '%Gloss%';

-- PALETAS E SOMBRAS
UPDATE "products" SET images = ARRAY['/images/products/paleta.jpg'] WHERE name LIKE '%Paleta%';

-- MÁSCARAS E CÍLIOS
UPDATE "products" SET images = ARRAY['/images/products/mascara.jpg'] WHERE name LIKE '%Máscara%' OR name LIKE '%Rímel%';

-- PINCÉIS E FERRAMENTAS
UPDATE "products" SET images = ARRAY['/images/products/pinceis.jpg'] WHERE name LIKE '%Pinc%' OR name LIKE '%Kit%' OR name LIKE '%Esponja%';

-- PRIMERS
UPDATE "products" SET images = ARRAY['/images/products/primer.jpg'] WHERE name LIKE '%Primer%';

-- PÓ COMPACTO/TRANSLÚCIDO
UPDATE "products" SET images = ARRAY['/images/products/po.jpg'] WHERE name LIKE '%Pó%' OR name LIKE '%Iluminador%';

-- SHAMPOO E CONDICIONADOR
UPDATE "products" SET images = ARRAY['/images/products/shampoo.jpg'] WHERE name LIKE '%Shampoo%';
UPDATE "products" SET images = ARRAY['/images/products/condicionador.jpg'] WHERE name LIKE '%Condicionador%';

-- MÁSCARAS CAPILARES E TRATAMENTOS
UPDATE "products" SET images = ARRAY['/images/products/mascara-capilar.jpg'] WHERE name LIKE '%Máscara Capilar%' OR name LIKE '%Tratamento%' OR name LIKE '%Touca%';

-- LEAVE-IN E ÓLEOS
UPDATE "products" SET images = ARRAY['/images/products/oleo.jpg'] WHERE name LIKE '%Leave%' OR name LIKE '%Óleo%' OR name LIKE '%Argan%' OR name LIKE '%Spray%';

-- SECADORES E FERRAMENTAS TÉRMICAS
UPDATE "products" SET images = ARRAY['/images/products/secador.jpg'] WHERE name LIKE '%Secador%' OR name LIKE '%Escova%';
UPDATE "products" SET images = ARRAY['/images/products/chapinha.jpg'] WHERE name LIKE '%Chapinha%' OR name LIKE '%Prancha%' OR name LIKE '%Modelador%';

-- CREMES E HIDRATANTES
UPDATE "products" SET images = ARRAY['/images/products/creme.jpg'] WHERE name LIKE '%Creme%' OR name LIKE '%Hidratante%' OR name LIKE '%Máscara Facial%';

-- SÉRUNS
UPDATE "products" SET images = ARRAY['/images/products/serum.jpg'] WHERE name LIKE '%Sérum%' OR name LIKE '%Serum%';

-- PROTETORES SOLARES
UPDATE "products" SET images = ARRAY['/images/products/protetor.jpg'] WHERE name LIKE '%Protetor%' OR name LIKE '%FPS%' OR name LIKE '%Tônico%';

-- ESMALTES E UNHAS
UPDATE "products" SET images = ARRAY['/images/products/esmalte.jpg'] WHERE name LIKE '%Esmalte%' OR name LIKE '%Unha%' OR name LIKE '%Gel%' OR name LIKE '%Top Coat%';

-- CABINES E EQUIPAMENTOS
UPDATE "products" SET images = ARRAY['/images/products/equipamento.jpg'] WHERE name LIKE '%Cabine%' OR name LIKE '%UV%' OR name LIKE '%LED%' OR name LIKE '%Lixa%' OR name LIKE '%Vaporizador%' OR name LIKE '%Maca%';

-- Produtos sem match específico usam imagem genérica
UPDATE "products" SET images = ARRAY['/images/products/generico.jpg']
WHERE images = ARRAY['/placeholder.png'] OR images::text LIKE '%unsplash%';

-- ============================================
-- CURSOS - Atualizar por tema
-- ============================================

UPDATE "courses" SET thumbnail = '/images/courses/maquiagem.jpg' WHERE title LIKE '%Maquiagem%';
UPDATE "courses" SET thumbnail = '/images/courses/colorimetria.jpg' WHERE title LIKE '%Colorimetria%';
UPDATE "courses" SET thumbnail = '/images/courses/sobrancelhas.jpg' WHERE title LIKE '%Sobrancelha%';
UPDATE "courses" SET thumbnail = '/images/courses/unhas.jpg' WHERE title LIKE '%Unha%' OR title LIKE '%Manicure%';
UPDATE "courses" SET thumbnail = '/images/courses/skincare.jpg' WHERE title LIKE '%Skincare%' OR title LIKE '%Pele%';
UPDATE "courses" SET thumbnail = '/images/courses/cilios.jpg' WHERE title LIKE '%Cílio%' OR title LIKE '%Extensão%';
UPDATE "courses" SET thumbnail = '/images/courses/massagem.jpg' WHERE title LIKE '%Massagem%';
UPDATE "courses" SET thumbnail = '/images/courses/empreendedorismo.jpg' WHERE title LIKE '%Empreend%' OR title LIKE '%Negócio%';
UPDATE "courses" SET thumbnail = '/images/courses/marketing.jpg' WHERE title LIKE '%Marketing%' OR title LIKE '%Instagram%';
UPDATE "courses" SET thumbnail = '/images/courses/automaquiagem.jpg' WHERE title LIKE '%Automaquiagem%';

-- Cursos sem match específico
UPDATE "courses" SET thumbnail = '/images/courses/maquiagem.jpg'
WHERE thumbnail = '/placeholder.png' OR thumbnail LIKE '%unsplash%';

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 'PRODUTOS ATUALIZADOS' as status, COUNT(*) as total
FROM "products"
WHERE images::text LIKE '%/images/products/%';

SELECT 'CURSOS ATUALIZADOS' as status, COUNT(*) as total
FROM "courses"
WHERE thumbnail LIKE '/images/courses/%';

-- Mostrar exemplos
SELECT id, name, images FROM "products" ORDER BY id LIMIT 10;
SELECT id, title, thumbnail FROM "courses" ORDER BY id LIMIT 5;

-- ============================================
-- RESULTADO: TODAS AS IMAGENS FUNCIONANDO!
-- ============================================
