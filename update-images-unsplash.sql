-- ============================================
-- ATUALIZAR IMAGENS COM URLs REAIS DO UNSPLASH
-- Imagens de produtos de beleza de alta qualidade
-- Execute no console Neon
-- ============================================

-- BASES E CORRETIVOS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800'] WHERE name LIKE '%Base Líquida%';
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'] WHERE name LIKE '%Corretivo%';

-- BATONS E LÁBIOS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'] WHERE name LIKE '%Batom%';
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800'] WHERE name LIKE '%Gloss%';

-- PALETAS E SOMBRAS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'] WHERE name LIKE '%Paleta%';

-- MÁSCARAS E CÍLIOS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800'] WHERE name LIKE '%Máscara%' OR name LIKE '%Rímel%';

-- PINCÉIS E FERRAMENTAS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800'] WHERE name LIKE '%Pinc%' OR name LIKE '%Kit%';

-- ESPONJAS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1557821552-17105176677c?w=800'] WHERE name LIKE '%Esponja%';

-- PRIMERS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'] WHERE name LIKE '%Primer%';

-- PÓ COMPACTO/TRANSLÚCIDO
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'] WHERE name LIKE '%Pó%';

-- SPRAY FIXADOR
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800'] WHERE name LIKE '%Spray%' OR name LIKE '%Fixador%';

-- SHAMPOO E CONDICIONADOR
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'] WHERE name LIKE '%Shampoo%';
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'] WHERE name LIKE '%Condicionador%';

-- MÁSCARAS CAPILARES
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'] WHERE name LIKE '%Máscara Capilar%' OR name LIKE '%Tratamento Capilar%';

-- LEAVE-IN E ÓLEOS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800'] WHERE name LIKE '%Leave%' OR name LIKE '%Óleo%' OR name LIKE '%Argan%';

-- SECADORES E FERRAMENTAS TÉRMICAS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800'] WHERE name LIKE '%Secador%';
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1522339382975-8d37430d8f28?w=800'] WHERE name LIKE '%Chapinha%' OR name LIKE '%Prancha%';

-- ESCOVAS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800'] WHERE name LIKE '%Escova%';

-- CREMES E HIDRATANTES
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'] WHERE name LIKE '%Creme%' OR name LIKE '%Hidratante%';

-- SÉRUNS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1620916297893-5c6f42d1e50b?w=800'] WHERE name LIKE '%Sérum%' OR name LIKE '%Serum%';

-- PROTETORES SOLARES
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'] WHERE name LIKE '%Protetor%' OR name LIKE '%FPS%';

-- LIMPADORES E TÔNICOS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'] WHERE name LIKE '%Tônico%' OR name LIKE '%Água Micelar%';

-- ESMALTES E UNHAS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800'] WHERE name LIKE '%Esmalte%' OR name LIKE '%Unha%';
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800'] WHERE name LIKE '%Gel%' AND name LIKE '%Unha%';

-- CABINES E EQUIPAMENTOS
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800'] WHERE name LIKE '%Cabine%' OR name LIKE '%UV%';
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1599351422459-f168536acb7e?w=800'] WHERE name LIKE '%Lixa Elétrica%' OR name LIKE '%Lixadeira%';

-- TOUCA TÉRMICA
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] WHERE name LIKE '%Touca%';

-- Produtos sem match específico usam imagem genérica de cosméticos
UPDATE "products" SET images = ARRAY['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800']
WHERE images IS NULL OR images = ARRAY['/placeholder.png'];

-- ============================================
-- ATUALIZAR THUMBNAILS DOS CURSOS
-- ============================================

UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800' WHERE title LIKE '%Maquiagem%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800' WHERE title LIKE '%Colorimetria%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800' WHERE title LIKE '%Sobrancelha%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800' WHERE title LIKE '%Unhas%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' WHERE title LIKE '%Skincare%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800' WHERE title LIKE '%Cílios%' OR title LIKE '%Extensão%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800' WHERE title LIKE '%Massagem%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800' WHERE title LIKE '%Empreend%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800' WHERE title LIKE '%Instagram%' OR title LIKE '%Marketing%';
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800' WHERE title LIKE '%Automaquiagem%';

-- Cursos sem match específico
UPDATE "courses" SET thumbnail = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800'
WHERE thumbnail IS NULL OR thumbnail = '' OR thumbnail = '/placeholder.png';

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 'Produtos atualizados:' as status, COUNT(*) as total FROM "products" WHERE images != ARRAY['/placeholder.png'];
SELECT 'Cursos atualizados:' as status, COUNT(*) as total FROM "courses" WHERE thumbnail != '/placeholder.png';

-- Mostrar alguns exemplos
SELECT name, images FROM "products" LIMIT 5;
SELECT title, thumbnail FROM "courses" LIMIT 5;
