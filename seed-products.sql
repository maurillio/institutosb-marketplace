-- ============================================
-- SEED PRODUTOS - THE BEAUTY PRO MARKETPLACE
-- 50 Produtos reais de beleza
-- Execute APÓS seed.sql
-- ============================================

-- Produtos de Maquiagem (13 produtos)
INSERT INTO "products" (id, name, slug, description, brand, "categoryId", "sellerId", price, "compareAtPrice", stock, condition, status, images, tags, "skinTypes", concerns, ingredients, "publishedAt", rating, "totalReviews", sales, "createdAt", "updatedAt")
VALUES
-- Bases e Corretivos (5)
('prod-001', 'Base Líquida HD Pro Coverage 30ml - Cor Bege Médio', 'base-liquida-hd-pro-coverage-bege-medio',
'Base líquida de alta cobertura com acabamento fosco natural. Desenvolvida especialmente para uso profissional, oferece cobertura buildable que pode ser aplicada do natural ao full coverage.

Características:
- Alta cobertura ajustável
- Acabamento matte natural
- Longa duração (até 24h)
- Oil-free e non-comedogenic
- Fórmula resistente à água e suor

Modo de uso: Aplicar com pincel, esponja ou dedos sobre a pele preparada.',
'Vult Professional', 'cat-bases-corretivos', 'vendedor-001', 89.90, 129.90, 45, 'NEW', 'ACTIVE',
ARRAY['/images/products/base-hd-vult-1.jpg']::TEXT[],
ARRAY['profissional', 'alta-cobertura', 'longa-duracao', 'oil-free']::TEXT[],
ARRAY['oleosa', 'mista']::TEXT[], ARRAY['uniformizar', 'alta-cobertura']::TEXT[],
ARRAY['Cyclopentasiloxane', 'Dimethicone', 'Titanium Dioxide']::TEXT[],
NOW(), 4.7, 42, 156, NOW(), NOW()),

('prod-002', 'Corretivo Líquido Full Coverage - Cor Clara', 'corretivo-liquido-full-coverage-cor-clara',
'Corretivo líquido de altíssima cobertura. Perfeito para cobrir olheiras escuras, manchas e imperfeições. Não marca, não racha. 16 horas de duração.',
'Ruby Rose', 'cat-bases-corretivos', 'vendedor-002', 34.90, 49.90, 60, 'NEW', 'ACTIVE',
ARRAY['/images/products/corretivo-ruby-rose-1.jpg']::TEXT[],
ARRAY['alta-cobertura', 'longa-duracao', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.5, 38, 189, NOW(), NOW()),

('prod-003', 'Primer Facial Matificante Pore Minimizer 30ml', 'primer-facial-matificante-pore-minimizer',
'Primer facial que minimiza poros e controla oleosidade por até 12 horas. Base perfeita para maquiagem profissional. Efeito blur.',
'Maybelline', 'cat-primers-fixadores', 'vendedor-003', 64.90, NULL, 50, 'NEW', 'ACTIVE',
ARRAY['/images/products/primer-maybelline-1.jpg']::TEXT[],
ARRAY['matificante', 'minimiza-poros', 'controle-oleosidade']::TEXT[],
ARRAY['oleosa', 'mista']::TEXT[], ARRAY['poros', 'oleosidade']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 51, 203, NOW(), NOW()),

('prod-004', 'Pó Compacto Translúcido Profissional 10g', 'po-compacto-translucido-profissional',
'Pó compacto translúcido profissional. Sela a maquiagem sem alterar a cor da base. Efeito matte natural. Com espelho.',
'Ludurana Professional', 'cat-primers-fixadores', 'vendedor-004', 42.90, NULL, 55, 'NEW', 'ACTIVE',
ARRAY['/images/products/po-compacto-ludurana-1.jpg']::TEXT[],
ARRAY['translucido', 'fixador', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 33, 142, NOW(), NOW()),

('prod-005', 'Spray Fixador de Maquiagem Ultra Longa Duração 100ml', 'spray-fixador-maquiagem-ultra-longa-duracao',
'Spray fixador profissional que prolonga a duração da maquiagem por até 16 horas. Resistente ao suor e umidade. Ideal para noivas.',
'Urban Decay', 'cat-primers-fixadores', 'vendedor-005', 159.90, 219.90, 35, 'NEW', 'ACTIVE',
ARRAY['/images/products/spray-fixador-ud-1.jpg']::TEXT[],
ARRAY['fixador', 'longa-duracao', 'profissional', 'resistente']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 67, 234, NOW(), NOW()),

-- Sombras e Paletas (4)
('prod-006', 'Paleta de Sombras Nude Essential 12 Cores', 'paleta-sombras-nude-essential-12-cores',
'Paleta com 12 sombras em tons nude essenciais. Mix de acabamentos matte, shimmer e metalizado. Alta pigmentação. Vegano e cruelty-free.',
'Ludurana Professional', 'cat-sombras-paletas', 'vendedor-006', 129.90, NULL, 30, 'NEW', 'ACTIVE',
ARRAY['/images/products/paleta-nude-1.jpg']::TEXT[],
ARRAY['vegano', 'cruelty-free', 'profissional', 'versatil']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 45, 167, NOW(), NOW()),

('prod-007', 'Paleta de Sombras Colorida Rainbow 18 Cores', 'paleta-sombras-colorida-rainbow-18-cores',
'Paleta com 18 cores vibrantes e pigmentadas. Ideal para maquiagem artística, editorial e criativa. 6 neons, 6 metálicos, 6 mattes.',
'Vult Professional', 'cat-sombras-paletas', 'vendedor-007', 149.90, NULL, 25, 'NEW', 'ACTIVE',
ARRAY['/images/products/paleta-rainbow-1.jpg']::TEXT[],
ARRAY['colorido', 'artistico', 'vegano', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 39, 145, NOW(), NOW()),

('prod-008', 'Iluminador Líquido Glow Intense 30ml', 'iluminador-liquido-glow-intense',
'Iluminador líquido com partículas ultra-finas. Brilho natural e luminoso. Efeito wet skin profissional. Pode ser misturado à base.',
'Ruby Rose', 'cat-sombras-paletas', 'vendedor-008', 44.90, NULL, 45, 'NEW', 'ACTIVE',
ARRAY['/images/products/iluminador-ruby-rose-1.jpg']::TEXT[],
ARRAY['iluminador', 'glow', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 52, 198, NOW(), NOW()),

('prod-009', 'Kit 12 Pincéis Profissionais de Maquiagem', 'kit-12-pinceis-profissionais-maquiagem',
'Kit completo com 12 pincéis profissionais de alta qualidade. Cerdas sintéticas macias. Inclui estojo protetor. Vegano, cruelty-free.',
'Macrilan', 'cat-pinceis-ferramentas', 'vendedor-009', 189.90, 279.90, 20, 'NEW', 'ACTIVE',
ARRAY['/images/products/kit-pinceis-1.jpg']::TEXT[],
ARRAY['pinceis', 'kit-completo', 'profissional', 'vegano']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 28, 89, NOW(), NOW()),

-- Batons (3)
('prod-010', 'Batom Líquido Matte Ultra HD - Vermelho Clássico', 'batom-liquido-matte-vermelho-classico',
'Batom líquido com acabamento matte aveludado. Alta pigmentação e conforto. Não transfere. Longa duração (até 12h). Enriquecido com Vitamina E.',
'Ruby Rose', 'cat-batons-glosses', 'vendedor-010', 34.90, 49.90, 60, 'NEW', 'ACTIVE',
ARRAY['/images/products/batom-ruby-rose-1.jpg']::TEXT[],
ARRAY['vegano', 'longa-duracao', 'matte', 'nao-transfere']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY['Vitamin E', 'Jojoba Oil']::TEXT[],
NOW(), 4.7, 73, 267, NOW(), NOW()),

('prod-011', 'Batom Cremoso Hidratante - Nude Rosé', 'batom-cremoso-hidratante-nude-rose',
'Batom cremoso ultra hidratante. Cor natural e confortável para uso diário. Acabamento acetinado. Fórmula com manteiga de karité.',
'Avon', 'cat-batons-glosses', 'vendedor-001', 29.90, NULL, 70, 'NEW', 'ACTIVE',
ARRAY['/images/products/batom-avon-1.jpg']::TEXT[],
ARRAY['hidratante', 'nude', 'uso-diario']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY['Shea Butter', 'Vitamin E']::TEXT[],
NOW(), 4.5, 56, 213, NOW(), NOW()),

('prod-012', 'Gloss Labial Ultra Brilho - Transparente com Glitter', 'gloss-labial-ultra-brilho-transparente-glitter',
'Gloss labial com brilho intenso e partículas de glitter. Efeito volumizador e hidratante. Sensação refrescante de menta.',
'Ludurana', 'cat-batons-glosses', 'vendedor-002', 24.90, NULL, 55, 'NEW', 'ACTIVE',
ARRAY['/images/products/gloss-ludurana-1.jpg']::TEXT[],
ARRAY['gloss', 'brilho', 'volumizador', 'glitter']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.4, 41, 178, NOW(), NOW()),

-- Shampoos (3)
('prod-013', 'Shampoo Profissional Hidratação Intensa 1L', 'shampoo-profissional-hidratacao-intensa-1l',
'Shampoo profissional desenvolvido para salões. Limpeza suave e hidratação profunda. Fórmula concentrada rende 2x mais. Com Óleo de Argan e Queratina. Livre de parabenos e sulfatos agressivos.',
'Salon Line', 'cat-shampoos', 'vendedor-003', 45.90, NULL, 80, 'NEW', 'ACTIVE',
ARRAY['/images/products/shampoo-salon-line-1.jpg']::TEXT[],
ARRAY['profissional', 'hidratante', 'vegano', 'concentrado']::TEXT[],
ARRAY['seco', 'danificado']::TEXT[], ARRAY['hidratacao', 'frizz', 'danos']::TEXT[],
ARRAY['Argan Oil', 'Silk Protein', 'Panthenol', 'Hydrolyzed Keratin']::TEXT[],
NOW(), 4.8, 94, 312, NOW(), NOW()),

('prod-014', 'Shampoo Matizador Silver Purple 500ml', 'shampoo-matizador-silver-purple-500ml',
'Shampoo matizador profissional para cabelos loiros, grisalhos e com luzes. Neutraliza tons amarelados. Pigmentos violeta de alta performance.',
'Truss', 'cat-shampoos', 'vendedor-004', 68.90, NULL, 40, 'NEW', 'ACTIVE',
ARRAY['/images/products/shampoo-matizador-1.jpg']::TEXT[],
ARRAY['matizador', 'profissional', 'loiros', 'grisalhos']::TEXT[],
ARRAY['loiro', 'grisalho']::TEXT[], ARRAY['amarelado', 'matizar']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 62, 187, NOW(), NOW()),

('prod-015', 'Shampoo Anti-Resíduos Deep Clean 1L', 'shampoo-anti-residuos-deep-clean-1l',
'Shampoo de limpeza profunda que remove resíduos de produtos, poluição e oleosidade. Preparação perfeita para tratamentos químicos.',
'Wella', 'cat-shampoos', 'vendedor-005', 52.90, NULL, 50, 'NEW', 'ACTIVE',
ARRAY['/images/products/shampoo-wella-1.jpg']::TEXT[],
ARRAY['anti-residuo', 'limpeza-profunda', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['residuos', 'oleosidade']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 48, 165, NOW(), NOW()),

-- Máscaras e Condicionadores (4)
('prod-016', 'Máscara Capilar Reconstrutora Nano Repair 500g', 'mascara-capilar-reconstrutora-nano-repair-500g',
'Máscara de tratamento intensivo com nanotecnologia. Reconstrói fibra capilar danificada. Reduz quebra em até 95%. Com Nano Queratina, Colágeno e Ácido Hialurônico.',
'Forever Liss', 'cat-condicionadores', 'vendedor-006', 79.90, 119.90, 55, 'NEW', 'ACTIVE',
ARRAY['/images/products/mascara-forever-liss-1.jpg']::TEXT[],
ARRAY['profissional', 'reconstrutor', 'nanotecnologia', 'tratamento-intensivo']::TEXT[],
ARRAY['muito-seco', 'danificado']::TEXT[], ARRAY['reconstrucao', 'quebra', 'danos-quimicos']::TEXT[],
ARRAY['Nano Keratin', 'Collagen', 'Amino Acids', 'Hyaluronic Acid', 'Shea Butter']::TEXT[],
NOW(), 4.9, 87, 298, NOW(), NOW()),

('prod-017', 'Condicionador Profissional Hidratante 1L', 'condicionador-profissional-hidratante-1l',
'Condicionador profissional que desembaraça, hidrata e sela as cutículas. Uso diário em salões. Facilita penteado e controla frizz.',
'Salon Line', 'cat-condicionadores', 'vendedor-007', 42.90, NULL, 70, 'NEW', 'ACTIVE',
ARRAY['/images/products/condicionador-salon-line-1.jpg']::TEXT[],
ARRAY['profissional', 'hidratante', 'uso-diario']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['hidratacao', 'frizz']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 76, 245, NOW(), NOW()),

('prod-018', 'Ampola de Tratamento Capilar Intensivo 15ml (caixa com 6)', 'ampola-tratamento-capilar-intensivo-caixa-6',
'Caixa com 6 ampolas de tratamento intensivo. Concentrado de ativos para recuperação express. Resultado imediato. 1 ampola por aplicação.',
'L''Oréal Professionnel', 'cat-tratamentos-capilares', 'vendedor-008', 129.90, 189.90, 30, 'NEW', 'ACTIVE',
ARRAY['/images/products/ampola-loreal-1.jpg']::TEXT[],
ARRAY['tratamento-intensivo', 'ampola', 'profissional', 'resultado-imediato']::TEXT[],
ARRAY['danificado', 'seco']::TEXT[], ARRAY['reconstrucao', 'hidratacao']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 53, 176, NOW(), NOW()),

('prod-019', 'Leave-in Multifuncional 10 em 1 - 200ml', 'leave-in-multifuncional-10-em-1',
'Leave-in sem enxágue com 10 benefícios. Desembaraça, controla frizz, proteção térmica, brilho, maciez. Uso profissional e home care.',
'Kerastase', 'cat-finalizadores', 'vendedor-009', 189.90, NULL, 35, 'NEW', 'ACTIVE',
ARRAY['/images/products/leave-in-kerastase-1.jpg']::TEXT[],
ARRAY['leave-in', 'multifuncional', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['frizz', 'protecao-termica']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 69, 198, NOW(), NOW()),

-- Finalizadores (3)
('prod-020', 'Finalizador Termo Protetor Spray 200ml', 'finalizador-termo-protetor-spray-200ml',
'Spray finalizador com proteção térmica até 230°C. Protege contra danos do calor. Reduz frizz e aumenta brilho. Tecnologia Heat Shield.',
'Tresemmé', 'cat-finalizadores', 'vendedor-010', 42.90, NULL, 70, 'NEW', 'ACTIVE',
ARRAY['/images/products/termo-protetor-1.jpg']::TEXT[],
ARRAY['termo-protetor', 'spray', 'profissional', 'protecao-calor']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['protecao-termica', 'frizz']::TEXT[],
ARRAY['Heat Shield Complex', 'Silicones', 'Vitamin E']::TEXT[],
NOW(), 4.7, 81, 276, NOW(), NOW()),

('prod-021', 'Óleo Capilar Finalizador Argan Marroquino 60ml', 'oleo-capilar-finalizador-argan-marroquino',
'Óleo capilar puro de argan marroquino. Brilho intenso, controla frizz e sela pontas duplas. Não pesa nos fios. 100% óleo puro prensado a frio.',
'Moroccanoil', 'cat-finalizadores', 'vendedor-001', 219.90, NULL, 25, 'NEW', 'ACTIVE',
ARRAY['/images/products/oleo-argan-1.jpg']::TEXT[],
ARRAY['oleo', 'argan', 'profissional', 'brilho']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['frizz', 'pontas-duplas', 'brilho']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 92, 287, NOW(), NOW()),

('prod-022', 'Sérum Anti-Frizz Efeito Liso 50ml', 'serum-anti-frizz-efeito-liso',
'Sérum potente anti-frizz que controla volume. Efeito liso natural. Controle de frizz até 72h. Efeito anti-umidade.',
'John Frieda', 'cat-finalizadores', 'vendedor-002', 89.90, NULL, 45, 'NEW', 'ACTIVE',
ARRAY['/images/products/serum-john-frieda-1.jpg']::TEXT[],
ARRAY['anti-frizz', 'serum', 'controle-volume']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['frizz', 'volume']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 58, 193, NOW(), NOW()),

-- Skincare - Séruns (4)
('prod-023', 'Sérum Facial Vitamina C 20% + Ácido Hialurônico 30ml', 'serum-facial-vitamina-c-20-acido-hialuronico-30ml',
'Sérum potente com Vitamina C pura 20% e Ácido Hialurônico. Clareia manchas em 4 semanas. Uniformiza tom e ilumina. pH 3.5. Dermatologicamente testado.',
'The Ordinary', 'cat-serums', 'vendedor-003', 159.90, 229.90, 40, 'NEW', 'ACTIVE',
ARRAY['/images/products/serum-vitamina-c-1.jpg']::TEXT[],
ARRAY['profissional', 'vitamina-c', 'clareador', 'anti-idade', 'dermatologico']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['manchas', 'uniformizar', 'anti-idade', 'luminosidade']::TEXT[],
ARRAY['L-Ascorbic Acid 20%', 'Hyaluronic Acid', 'Vitamin E', 'Ferulic Acid']::TEXT[],
NOW(), 4.8, 103, 342, NOW(), NOW()),

('prod-024', 'Sérum Facial Niacinamida 10% + Zinco 1% - 30ml', 'serum-facial-niacinamida-10-zinco-1-30ml',
'Sérum com alta concentração de Niacinamida. Controla oleosidade, minimiza poros e uniformiza pele. Ideal para pele oleosa e acneica.',
'The Ordinary', 'cat-serums', 'vendedor-004', 129.90, NULL, 50, 'NEW', 'ACTIVE',
ARRAY['/images/products/serum-niacinamida-1.jpg']::TEXT[],
ARRAY['niacinamida', 'controle-oleosidade', 'poros']::TEXT[],
ARRAY['oleosa', 'acneica']::TEXT[], ARRAY['oleosidade', 'poros', 'manchas', 'acne']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 87, 289, NOW(), NOW()),

('prod-025', 'Sérum Facial Ácido Hialurônico Puro 2% - 30ml', 'serum-facial-acido-hialuronico-puro-2-30ml',
'Sérum hidratante com Ácido Hialurônico puro em 3 pesos moleculares. Hidratação profunda e efeito preenchedor. Para todos os tipos de pele.',
'La Roche-Posay', 'cat-serums', 'vendedor-005', 179.90, NULL, 35, 'NEW', 'ACTIVE',
ARRAY['/images/products/serum-acido-hialuronico-1.jpg']::TEXT[],
ARRAY['acido-hialuronico', 'hidratante', 'anti-idade']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['desidratacao', 'linhas-finas', 'anti-idade']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 96, 312, NOW(), NOW()),

('prod-026', 'Sérum Facial Retinol 1% + Ácido Hialurônico - 30ml', 'serum-facial-retinol-1-acido-hialuronico-30ml',
'Sérum anti-idade com Retinol 1% de liberação gradual. Reduz rugas e linhas. Melhora textura da pele. SEMPRE usar protetor solar.',
'CeraVe', 'cat-serums', 'vendedor-006', 149.90, NULL, 30, 'NEW', 'ACTIVE',
ARRAY['/images/products/serum-retinol-1.jpg']::TEXT[],
ARRAY['retinol', 'anti-idade', 'rugas']::TEXT[],
ARRAY['normal', 'seca', 'mista']::TEXT[], ARRAY['rugas', 'anti-idade', 'textura']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 74, 245, NOW(), NOW()),

-- Proteção Solar (2)
('prod-027', 'Protetor Solar Facial FPS 70 Color Nude 50ml', 'protetor-solar-facial-fps-70-color-nude-50ml',
'Protetor solar facial com cor e alta proteção FPS 70. Cobertura leve e natural. Controle de oleosidade. Toque seco. Com Niacinamida. Resistente à água.',
'Isdin', 'cat-protecao-solar', 'vendedor-007', 119.90, NULL, 50, 'NEW', 'ACTIVE',
ARRAY['/images/products/protetor-isdin-1.jpg']::TEXT[],
ARRAY['fps-70', 'com-cor', 'toque-seco', 'dermatologico', 'profissional']::TEXT[],
ARRAY['oleosa', 'mista', 'todos']::TEXT[], ARRAY['protecao-solar', 'manchas', 'anti-idade']::TEXT[],
ARRAY['Zinc Oxide', 'Titanium Dioxide', 'Niacinamide', 'Vitamin E']::TEXT[],
NOW(), 4.9, 128, 456, NOW(), NOW()),

('prod-028', 'Protetor Solar Corporal FPS 50 - 200ml', 'protetor-solar-corporal-fps-50-200ml',
'Protetor solar corporal de alta proteção FPS 50. Textura leve, rápida absorção. Resistente à água e suor (80 min). Ideal para toda família.',
'La Roche-Posay', 'cat-protecao-solar', 'vendedor-008', 149.90, NULL, 45, 'NEW', 'ACTIVE',
ARRAY['/images/products/protetor-corporal-1.jpg']::TEXT[],
ARRAY['fps-50', 'corporal', 'resistente-agua']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['protecao-solar']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 89, 298, NOW(), NOW()),

-- Máscaras Faciais (3)
('prod-029', 'Máscara Facial Argila Preta Detox 100g', 'mascara-facial-argila-preta-detox-100g',
'Máscara de argila preta purificante. Remove impurezas profundas, controla oleosidade e minimiza poros. Com Carvão Ativado e Ácido Salicílico 1%.',
'L''Oréal Paris', 'cat-mascaras-faciais', 'vendedor-009', 54.90, NULL, 65, 'NEW', 'ACTIVE',
ARRAY['/images/products/mascara-argila-1.jpg']::TEXT[],
ARRAY['purificante', 'detox', 'argila', 'dermatologico']::TEXT[],
ARRAY['oleosa', 'acneica', 'mista']::TEXT[], ARRAY['poros', 'cravos', 'oleosidade', 'acne']::TEXT[],
ARRAY['Black Clay', 'Activated Charcoal', 'Niacinamide', 'Witch Hazel', 'Salicylic Acid 1%']::TEXT[],
NOW(), 4.6, 72, 234, NOW(), NOW()),

('prod-030', 'Máscara Facial Hidratante Overnight 50ml', 'mascara-facial-hidratante-overnight-50ml',
'Máscara hidratante noturna que age enquanto você dorme. Hidratação intensa por 24h. Pele radiante ao acordar. Com Ácido Hialurônico e Ceramidas.',
'Neutrogena', 'cat-mascaras-faciais', 'vendedor-010', 89.90, NULL, 40, 'NEW', 'ACTIVE',
ARRAY['/images/products/mascara-overnight-1.jpg']::TEXT[],
ARRAY['hidratante', 'overnight', 'noturna']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['desidratacao', 'hidratacao']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 64, 198, NOW(), NOW()),

('prod-031', 'Kit 5 Sheet Masks Hidratantes Variadas', 'kit-5-sheet-masks-hidratantes-variadas',
'Kit com 5 máscaras faciais em tecido com diferentes ativos: Ácido Hialurônico, Colágeno, Vitamina C, Chá Verde, Aloe Vera. Uso único.',
'Garnier', 'cat-mascaras-faciais', 'vendedor-001', 64.90, NULL, 55, 'NEW', 'ACTIVE',
ARRAY['/images/products/sheet-masks-1.jpg']::TEXT[],
ARRAY['sheet-mask', 'hidratante', 'kit', 'pratico']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['hidratacao']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 83, 276, NOW(), NOW()),

-- Esmaltes Gel (4)
('prod-032', 'Esmalte Gel UV LED 3 em 1 - Rosa Quartzo 8ml', 'esmalte-gel-uv-led-3-em-1-rosa-quartzo-8ml',
'Esmalte em gel 3 em 1 (base, cor e top coat). Cobertura total em 2 camadas. Durabilidade de até 21 dias. Cura em 30s LED. Tom nude rosado universal.',
'Risqué', 'cat-gel-uv', 'vendedor-002', 24.90, NULL, 100, 'NEW', 'ACTIVE',
ARRAY['/images/products/esmalte-gel-risque-1.jpg']::TEXT[],
ARRAY['gel', 'profissional', '3-em-1', 'longa-duracao', 'facil-aplicacao']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 112, 467, NOW(), NOW()),

('prod-033', 'Esmalte Gel UV LED - Vermelho Intenso 8ml', 'esmalte-gel-uv-led-vermelho-intenso-8ml',
'Esmalte em gel profissional cor vermelha intensa. Alta pigmentação, cobertura em 2 camadas. Cura: 30s LED. Durabilidade: 15-21 dias.',
'Risqué', 'cat-gel-uv', 'vendedor-003', 22.90, NULL, 90, 'NEW', 'ACTIVE',
ARRAY['/images/products/esmalte-gel-vermelho-1.jpg']::TEXT[],
ARRAY['gel', 'profissional', 'vermelho', 'classico']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 98, 398, NOW(), NOW()),

('prod-034', 'Base Coat Gel UV LED - Fortificante 15ml', 'base-coat-gel-uv-led-fortificante-15ml',
'Base coat em gel profissional. Prepara e fortalece unhas. Aumenta aderência do esmalte gel. Essencial para aplicação profissional.',
'OPI', 'cat-gel-uv', 'vendedor-004', 89.90, NULL, 40, 'NEW', 'ACTIVE',
ARRAY['/images/products/base-coat-gel-1.jpg']::TEXT[],
ARRAY['base-coat', 'gel', 'profissional', 'fortificante']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 76, 254, NOW(), NOW()),

('prod-035', 'Top Coat Gel UV LED - Ultra Brilho 15ml', 'top-coat-gel-uv-led-ultra-brilho-15ml',
'Top coat em gel profissional. Finalização com brilho intenso tipo diamante. Protege a cor e aumenta durabilidade. Não amarela.',
'OPI', 'cat-gel-uv', 'vendedor-005', 94.90, NULL, 45, 'NEW', 'ACTIVE',
ARRAY['/images/products/top-coat-gel-1.jpg']::TEXT[],
ARRAY['top-coat', 'gel', 'profissional', 'brilho']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 82, 287, NOW(), NOW()),

-- Ferramentas Unhas (2)
('prod-036', 'Kit Profissional de Alicate e Ferramentas para Manicure 7 Peças', 'kit-profissional-alicate-ferramentas-manicure-7-pecas',
'Kit completo em aço inoxidável cirúrgico 420. Esterilizável em autoclave. Inclui alicates, espátula, palito, lixa e estojo. Garantia 12 meses. Certificado ANVISA.',
'Mundial', 'cat-ferramentas-unhas', 'vendedor-006', 189.90, 279.90, 35, 'NEW', 'ACTIVE',
ARRAY['/images/products/kit-alicate-mundial-1.jpg', '/images/products/kit-alicate-mundial-2.jpg']::TEXT[],
ARRAY['profissional', 'aco-inoxidavel', 'esterilizavel', 'duravel', 'kit-completo']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 67, 198, NOW(), NOW()),

('prod-037', 'Lixa Elétrica para Unhas Profissional', 'lixa-eletrica-para-unhas-profissional',
'Lixa elétrica profissional 35.000 RPM. 6 velocidades ajustáveis. Inclui 6 brocas, pedal de controle e suporte. Bivolt automático. Garantia 12 meses.',
'Melhores Artigos Professional', 'cat-ferramentas-unhas', 'vendedor-007', 349.90, 499.90, 20, 'NEW', 'ACTIVE',
ARRAY['/images/products/lixa-eletrica-1.jpg']::TEXT[],
ARRAY['lixa-eletrica', 'profissional', 'motor-potente', 'salao']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 43, 134, NOW(), NOW()),

-- Equipamentos (4)
('prod-038', 'Secador Profissional Ionic 2200W Motor AC', 'secador-profissional-ionic-2200w-motor-ac',
'Secador profissional com Motor AC de 2000+ horas. Tecnologia iônica. 2200W de potência. 2 velocidades, 3 temperaturas. Bivolt. Inclui bicos e difusor. Certificado INMETRO.',
'Taiff', 'cat-secadores', 'vendedor-008', 389.90, 549.90, 20, 'NEW', 'ACTIVE',
ARRAY['/images/products/secador-taiff-1.jpg', '/images/products/secador-taiff-2.jpg']::TEXT[],
ARRAY['profissional', 'motor-ac', 'ionic', 'duravel', 'salao']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['frizz']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 89, 276, NOW(), NOW()),

('prod-039', 'Chapinha Profissional Titanium 230°C', 'chapinha-profissional-titanium-230c',
'Chapinha profissional com placas 100% Titanium. Aquecimento em 30s. Temperatura ajustável 150-230°C. Display digital LED. Placas flutuantes. Bivolt. Garantia 12 meses.',
'Babyliss Pro', 'cat-chapinhas', 'vendedor-009', 549.90, 799.90, 15, 'NEW', 'ACTIVE',
ARRAY['/images/products/chapinha-babyliss-1.jpg']::TEXT[],
ARRAY['chapinha', 'profissional', 'titanium', 'salao']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 72, 213, NOW(), NOW()),

('prod-040', 'Cabine UV LED 54W Profissional - Sun 5 Plus', 'cabine-uv-led-54w-profissional-sun-5-plus',
'Cabine UV LED profissional 54W. Tecnologia dual (UV+LED). 36 lâmpadas. Sensor automático. Timer inteligente. Base removível para pedicure. Vida útil 50.000h. Certificado ANATEL/INMETRO.',
'Sun', 'cat-cabines-uv', 'vendedor-010', 349.90, 499.90, 25, 'NEW', 'ACTIVE',
ARRAY['/images/products/cabine-sun5-1.jpg', '/images/products/cabine-sun5-2.jpg']::TEXT[],
ARRAY['profissional', 'uv-led', 'dual', 'sensor', 'salao', 'manicure']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.9, 94, 312, NOW(), NOW()),

('prod-041', 'Vaporizador Facial Profissional com Ozônio', 'vaporizador-facial-profissional-ozonio',
'Vaporizador facial profissional com função ozônio. Vapor quente contínuo. Braço articulado ajustável. Reservatório 1L. Timer automático. Rodízios para mobilidade. Garantia 12 meses.',
'Tonederm', 'cat-vaporizadores', 'vendedor-001', 449.90, NULL, 12, 'NEW', 'ACTIVE',
ARRAY['/images/products/vaporizador-1.jpg']::TEXT[],
ARRAY['vaporizador', 'profissional', 'estetica', 'ozonio']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 36, 89, NOW(), NOW()),

-- Produtos extras para completar 50
('prod-042', 'Removedor de Esmalte Gel Profissional 100ml', 'removedor-esmalte-gel-profissional-100ml',
'Removedor profissional para esmalte em gel. Remove rapidamente sem danificar unhas. Fórmula enriquecida com vitaminas. Não resseca cutículas.',
'Risqué', 'cat-gel-uv', 'vendedor-002', 34.90, NULL, 60, 'NEW', 'ACTIVE',
ARRAY['/images/products/removedor-gel-1.jpg']::TEXT[],
ARRAY['removedor', 'gel', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 48, 167, NOW(), NOW()),

('prod-043', 'Óleo de Cutícula Hidratante 15ml', 'oleo-cuticula-hidratante-15ml',
'Óleo hidratante para cutículas com Vitamina E e óleos vegetais. Hidrata, amacia e fortalece cutículas. Aplicador tipo caneta. Uso diário.',
'Risqué', 'cat-tratamentos-unhas', 'vendedor-003', 18.90, NULL, 80, 'NEW', 'ACTIVE',
ARRAY['/images/products/oleo-cuticula-1.jpg']::TEXT[],
ARRAY['oleo', 'cuticula', 'hidratante']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['hidratacao']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 92, 345, NOW(), NOW()),

('prod-044', 'Fortalecedor de Unhas Intensivo 10ml', 'fortalecedor-unhas-intensivo-10ml',
'Fortalecedor intensivo para unhas fracas e quebradiças. Fórmula com Cálcio e Proteínas. Resultado em 7 dias. Pode ser usado como base.',
'Colorama', 'cat-tratamentos-unhas', 'vendedor-004', 24.90, NULL, 70, 'NEW', 'ACTIVE',
ARRAY['/images/products/fortalecedor-1.jpg']::TEXT[],
ARRAY['fortalecedor', 'calcio', 'proteinas']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY['unhas-fracas', 'quebra']::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.5, 67, 234, NOW(), NOW()),

('prod-045', 'Kit Nail Art - Pincéis e Dotting Tools 10 Peças', 'kit-nail-art-pinceis-dotting-tools-10-pecas',
'Kit completo para nail art. 7 pincéis de diferentes tamanhos e 3 dotting tools. Ideal para decoração artística. Cerdas sintéticas de qualidade.',
'Ludurana', 'cat-nail-art', 'vendedor-005', 49.90, 69.90, 40, 'NEW', 'ACTIVE',
ARRAY['/images/products/kit-nail-art-1.jpg']::TEXT[],
ARRAY['nail-art', 'pinceis', 'dotting', 'kit']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 54, 187, NOW(), NOW()),

('prod-046', 'Glitter Mix para Unhas - 12 Cores', 'glitter-mix-unhas-12-cores',
'Mix de glitters em 12 cores vibrantes. Para decoração de unhas. Fácil aplicação. Rende múltiplas aplicações. Cores: dourado, prata, rosa, azul, verde, etc.',
'Ludurana', 'cat-nail-art', 'vendedor-006', 34.90, NULL, 50, 'NEW', 'ACTIVE',
ARRAY['/images/products/glitter-mix-1.jpg']::TEXT[],
ARRAY['glitter', 'nail-art', 'decoracao', 'colorido']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 71, 256, NOW(), NOW()),

('prod-047', 'Escova Rotativa Modeladora 1000W', 'escova-rotativa-modeladora-1000w',
'Escova rotativa profissional 1000W. 2 velocidades, 2 temperaturas. Rotação bidirecional. Cerdas de nylon e javalí. Bivolt. Ideal para alisamento e volume.',
'Taiff', 'cat-secadores', 'vendedor-007', 189.90, 249.90, 30, 'NEW', 'ACTIVE',
ARRAY['/images/products/escova-rotativa-1.jpg']::TEXT[],
ARRAY['escova-rotativa', 'modeladora', 'profissional']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 58, 178, NOW(), NOW()),

('prod-048', 'Babyliss Profissional 25mm Cerâmica', 'babyliss-profissional-25mm-ceramica',
'Babyliss profissional com barril de 25mm em cerâmica. Temperatura ajustável até 200°C. Aquecimento rápido. Ponta fria. Bivolt. Ideal para cachos definidos.',
'Taiff', 'cat-chapinhas', 'vendedor-008', 249.90, 349.90, 25, 'NEW', 'ACTIVE',
ARRAY['/images/products/babyliss-1.jpg']::TEXT[],
ARRAY['babyliss', 'ceramica', 'profissional', 'cachos']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.8, 64, 198, NOW(), NOW()),

('prod-049', 'Touca Térmica Profissional com Timer', 'touca-termica-profissional-timer',
'Touca térmica profissional para tratamentos capilares. Controle de temperatura. Timer programável. Potencializa absorção de produtos. 127V ou 220V.',
'Luminus', 'cat-equipamentos', 'vendedor-009', 279.90, NULL, 18, 'NEW', 'ACTIVE',
ARRAY['/images/products/touca-termica-1.jpg']::TEXT[],
ARRAY['touca-termica', 'profissional', 'tratamento']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.6, 39, 112, NOW(), NOW()),

('prod-050', 'Maca Estética Profissional Regulável', 'maca-estetica-profissional-regulavel',
'Maca estética profissional. Estrutura reforçada suporta até 150kg. Altura regulável. Estofado confortável. Fácil limpeza. Cor: preta. Ideal para clínicas e salões.',
'Lettro', 'cat-mobiliario', 'vendedor-010', 1499.90, 1999.90, 8, 'NEW', 'ACTIVE',
ARRAY['/images/products/maca-1.jpg']::TEXT[],
ARRAY['maca', 'estetica', 'profissional', 'regulavel']::TEXT[],
ARRAY['todos']::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
NOW(), 4.7, 27, 64, NOW(), NOW());

-- ============================================
-- FIM DOS PRODUTOS
-- ============================================
-- Total: 50 produtos reais e variados
-- Distribuídos entre 10 vendedores
-- Todas as categorias cobertas
-- ============================================
