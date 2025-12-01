export interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  brand?: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  condition: 'NEW' | 'USED' | 'LIKE_NEW';
  images: string[];
  tags?: string[];
  skinTypes?: string[];
  concerns?: string[];
  ingredients?: string[];
}

export const productsData: ProductSeed[] = [
  // MAQUIAGEM - Bases e Corretivos (5 produtos)
  {
    name: 'Base Líquida HD Pro Coverage 30ml - Cor Bege Médio',
    slug: 'base-liquida-hd-pro-coverage-bege-medio',
    description: `Base líquida de alta cobertura com acabamento fosco natural. Desenvolvida especialmente para uso profissional, oferece cobertura buildable que pode ser aplicada do natural ao full coverage.

Características:
- Alta cobertura ajustável
- Acabamento matte natural
- Longa duração (até 24h)
- Oil-free e non-comedogenic
- Fórmula resistente à água e suor
- Não transfere para roupas
- Livre de fragrância

Indicada para:
- Peles oleosas a mistas
- Uso profissional em maquiagens de eventos
- Fotografias e vídeos (sem flashback)
- Climas quentes e úmidos

Modo de uso:
Aplicar com pincel, esponja ou dedos sobre a pele preparada. Construir a cobertura conforme necessário.`,
    brand: 'Vult Professional',
    categorySlug: 'bases-corretivos',
    price: 89.90,
    compareAtPrice: 129.90,
    stock: 45,
    condition: 'NEW',
    images: ['/images/products/base-hd-vult-1.jpg'],
    tags: ['profissional', 'alta-cobertura', 'longa-duracao', 'oil-free'],
    skinTypes: ['oleosa', 'mista'],
    concerns: ['uniformizar', 'alta-cobertura'],
    ingredients: ['Cyclopentasiloxane', 'Dimethicone', 'Titanium Dioxide', 'Iron Oxides'],
  },
  {
    name: 'Corretivo Líquido Full Coverage - Cor Clara',
    slug: 'corretivo-liquido-full-coverage-cor-clara',
    description: `Corretivo líquido de altíssima cobertura. Perfeito para cobrir olheiras escuras, manchas e imperfeições. Não marca, não racha.

Características:
- Cobertura máxima em uma camada
- Acabamento natural
- Não resseca o contorno dos olhos
- 16 horas de duração
- À prova d'água
- Aplicador preciso

Ideal para:
- Olheiras severas
- Manchas e cicatrizes
- Imperfeições e vermelhidões
- Todos os tipos de pele`,
    brand: 'Ruby Rose',
    categorySlug: 'bases-corretivos',
    price: 34.90,
    compareAtPrice: 49.90,
    stock: 60,
    condition: 'NEW',
    images: ['/images/products/corretivo-ruby-rose-1.jpg'],
    tags: ['alta-cobertura', 'longa-duracao', 'profissional'],
  },
  {
    name: 'Primer Facial Matificante Pore Minimizer 30ml',
    slug: 'primer-facial-matificante-pore-minimizer',
    description: `Primer facial que minimiza poros e controla oleosidade por até 12 horas. Base perfeita para maquiagem profissional.

Tecnologia:
- Blur effect (efeito soft focus)
- Controle de oleosidade 12h
- Minimiza aparência dos poros
- Aumenta fixação da maquiagem
- Textura aveludada

Benefícios:
- Pele lisa e uniforme
- Maquiagem dura mais tempo
- Controla brilho excessivo
- Pode ser usado sozinho

Para peles oleosas e mistas.`,
    brand: 'Maybelline',
    categorySlug: 'primers-fixadores',
    price: 64.90,
    stock: 50,
    condition: 'NEW',
    images: ['/images/products/primer-maybelline-1.jpg'],
    tags: ['matificante', 'minimiza-poros', 'controle-oleosidade'],
    skinTypes: ['oleosa', 'mista'],
    concerns: ['poros', 'oleosidade'],
  },
  {
    name: 'Pó Compacto Translúcido Profissional 10g',
    slug: 'po-compacto-translucido-profissional',
    description: `Pó compacto translúcido profissional. Sela a maquiagem sem alterar a cor da base. Efeito matte natural.

Características:
- Translúcido (não altera tom da base)
- Controla oleosidade
- Sela maquiagem
- Não marca linhas de expressão
- Acabamento natural
- Embalagem com espelho

Modo de uso:
Aplicar após base e corretivo com pincel ou esponja. Pode ser reaplicado durante o dia.

Ideal para fixação profissional e retoques.`,
    brand: 'Ludurana Professional',
    categorySlug: 'primers-fixadores',
    price: 42.90,
    stock: 55,
    condition: 'NEW',
    images: ['/images/products/po-compacto-ludurana-1.jpg'],
    tags: ['translucido', 'fixador', 'profissional'],
  },
  {
    name: 'Spray Fixador de Maquiagem Ultra Longa Duração 100ml',
    slug: 'spray-fixador-maquiagem-ultra-longa-duracao',
    description: `Spray fixador profissional que prolonga a duração da maquiagem por até 16 horas. Resistente ao suor e umidade.

Tecnologia:
- Fixação de até 16 horas
- Resistente à água e suor
- Não altera o acabamento da maquiagem
- Fórmula leve e refrescante
- Secagem rápida

Ideal para:
- Noivas e eventos longos
- Climas quentes e úmidos
- Fotografias e vídeos
- Uso profissional

Modo de uso:
Borrifar a 20cm do rosto após finalizar a maquiagem. Aguardar secar naturalmente.`,
    brand: 'Urban Decay',
    categorySlug: 'primers-fixadores',
    price: 159.90,
    compareAtPrice: 219.90,
    stock: 35,
    condition: 'NEW',
    images: ['/images/products/spray-fixador-ud-1.jpg'],
    tags: ['fixador', 'longa-duracao', 'profissional', 'resistente'],
  },

  // MAQUIAGEM - Sombras e Paletas (4 produtos)
  {
    name: 'Paleta de Sombras Nude Essential 12 Cores',
    slug: 'paleta-sombras-nude-essential-12-cores',
    description: `Paleta com 12 sombras em tons nude essenciais, perfeita para criar looks do dia ao mais elaborado. Mix de acabamentos matte, shimmer e metalizado.

Características:
- 12 cores versáteis (6 mattes, 4 shimmers, 2 metalizados)
- Alta pigmentação
- Fácil esfumado
- Longa duração
- Vegano e cruelty-free
- Espelho incluso

Cores incluídas:
Linha 1: Vanilla Matte, Champagne Shimmer, Caramel Matte, Bronze Metallic
Linha 2: Nude Rose Matte, Gold Shimmer, Chocolate Matte, Copper Metallic
Linha 3: Taupe Matte, Peach Shimmer, Espresso Matte, Pink Gold Shimmer

Ideal para todos os tipos de pele e ocasiões.`,
    brand: 'Ludurana Professional',
    categorySlug: 'sombras-paletas',
    price: 129.90,
    stock: 30,
    condition: 'NEW',
    images: ['/images/products/paleta-nude-1.jpg'],
    tags: ['vegano', 'cruelty-free', 'profissional', 'versatil'],
    skinTypes: ['todos'],
  },
  {
    name: 'Paleta de Sombras Colorida Rainbow 18 Cores',
    slug: 'paleta-sombras-colorida-rainbow-18-cores',
    description: `Paleta com 18 cores vibrantes e pigmentadas. Ideal para maquiagem artística, editorial e criativa.

18 cores intensas:
- 6 neons (rosa, laranja, amarelo, verde, azul, roxo)
- 6 metálicos (dourado, prata, bronze, cobre, azul, verde)
- 6 mattes (vermelho, pink, roxo, azul, verde, preto)

Alta pigmentação, fácil aplicação, longa duração.
Vegano e cruelty-free.`,
    brand: 'Vult Professional',
    categorySlug: 'sombras-paletas',
    price: 149.90,
    stock: 25,
    condition: 'NEW',
    images: ['/images/products/paleta-rainbow-1.jpg'],
    tags: ['colorido', 'artistico', 'vegano', 'profissional'],
  },
  {
    name: 'Iluminador Líquido Glow Intense 30ml',
    slug: 'iluminador-liquido-glow-intense',
    description: `Iluminador líquido com partículas ultra-finas que proporcionam brilho natural e luminoso. Efeito wet skin profissional.

Benefícios:
- Brilho intenso e natural
- Não sai com partículas grandes
- Pode ser usado sozinho ou misturado à base
- Efeito "pele molhada"
- Longa duração

Pontos de aplicação:
Maçãs do rosto, arco do cupido, nariz, pálpebras, clavícula.

Tons disponíveis: Champagne (este), Rose Gold, Bronze.`,
    brand: 'Ruby Rose',
    categorySlug: 'sombras-paletas',
    price: 44.90,
    stock: 45,
    condition: 'NEW',
    images: ['/images/products/iluminador-ruby-rose-1.jpg'],
    tags: ['iluminador', 'glow', 'profissional'],
  },
  {
    name: 'Kit 12 Pincéis Profissionais de Maquiagem',
    slug: 'kit-12-pinceis-profissionais-maquiagem',
    description: `Kit completo com 12 pincéis profissionais de alta qualidade. Cerdas sintéticas macias, cabos em madeira.

Composição:
- Pincel base líquida
- Pincel base cremosa
- Pincel corretivo
- Pincel pó facial
- Pincel blush
- Pincel contorno
- Pincel esfumador
- Pincel cônico (crease)
- Pincel delineador
- Pincel lábios
- Pincel chanfrado (sobrancelhas)
- Pincel leque (iluminador)

Inclui estojo protetor.
Vegano, cruelty-free.
Laváveis e duráveis.`,
    brand: 'Macrilan',
    categorySlug: 'pinceis-ferramentas',
    price: 189.90,
    compareAtPrice: 279.90,
    stock: 20,
    condition: 'NEW',
    images: ['/images/products/kit-pinceis-1.jpg'],
    tags: ['pinceis', 'kit-completo', 'profissional', 'vegano'],
  },

  // MAQUIAGEM - Batons (3 produtos)
  {
    name: 'Batom Líquido Matte Ultra HD - Vermelho Clássico',
    slug: 'batom-liquido-matte-vermelho-classico',
    description: `Batom líquido com acabamento matte aveludado. Alta pigmentação e conforto o dia todo. Cor vibrante que não transfere.

Características:
- Acabamento matte suave
- Não transfere (transfer-proof)
- Longa duração (até 12h)
- Não resseca os lábios
- Alta pigmentação
- Aplicador preciso

Composição:
Enriquecido com Vitamina E e óleos vegetais que hidratam enquanto colorem.`,
    brand: 'Ruby Rose',
    categorySlug: 'batons-glosses',
    price: 34.90,
    compareAtPrice: 49.90,
    stock: 60,
    condition: 'NEW',
    images: ['/images/products/batom-ruby-rose-1.jpg'],
    tags: ['vegano', 'longa-duracao', 'matte', 'nao-transfere'],
    ingredients: ['Vitamin E', 'Jojoba Oil', 'Castor Oil'],
  },
  {
    name: 'Batom Cremoso Hidratante - Nude Rosé',
    slug: 'batom-cremoso-hidratante-nude-rose',
    description: `Batom cremoso ultra hidratante. Cor natural e confortável para uso diário. Acabamento acetinado.

Características:
- Hidratação intensa
- Cor buildable
- Acabamento acetinado
- Fragrância suave de baunilha
- Fórmula com manteiga de karité

Cor Nude Rosé: tom nude universal com subtom rosado, perfeito para qualquer ocasião.`,
    brand: 'Avon',
    categorySlug: 'batons-glosses',
    price: 29.90,
    stock: 70,
    condition: 'NEW',
    images: ['/images/products/batom-avon-1.jpg'],
    tags: ['hidratante', 'nude', 'uso-diario'],
    ingredients: ['Shea Butter', 'Vitamin E'],
  },
  {
    name: 'Gloss Labial Ultra Brilho - Transparente com Glitter',
    slug: 'gloss-labial-ultra-brilho-transparente-glitter',
    description: `Gloss labial com brilho intenso e partículas de glitter. Efeito volumizador e hidratante.

Características:
- Brilho intenso
- Glitter fino e elegante
- Efeito volumizador (ingrediente plump)
- Hidratação
- Pode ser usado sozinho ou sobre batom
- Aplicador flocado

Sensação refrescante de menta.`,
    brand: 'Ludurana',
    categorySlug: 'batons-glosses',
    price: 24.90,
    stock: 55,
    condition: 'NEW',
    images: ['/images/products/gloss-ludurana-1.jpg'],
    tags: ['gloss', 'brilho', 'volumizador', 'glitter'],
  },

  // CABELO - Shampoos (3 produtos)
  {
    name: 'Shampoo Profissional Hidratação Intensa 1L',
    slug: 'shampoo-profissional-hidratacao-intensa-1l',
    description: `Shampoo profissional desenvolvido para salões. Promove limpeza suave e hidratação profunda. Fórmula concentrada rende até 2x mais.

Tecnologia Professional:
- Limpeza suave sem ressecar
- Hidratação desde a primeira aplicação
- Controle de frizz
- Proteção da cor
- pH balanceado

Ativos principais:
- Óleo de Argan Marroquino
- Proteínas da Seda
- Pantenol (Pro-Vitamina B5)
- Queratina Hidrolisada

Rendimento: 1 litro rende aproximadamente 30-40 aplicações profissionais.
Livre de parabenos, sulfatos agressivos, petrolatos.`,
    brand: 'Salon Line',
    categorySlug: 'shampoos',
    price: 45.90,
    stock: 80,
    condition: 'NEW',
    images: ['/images/products/shampoo-salon-line-1.jpg'],
    tags: ['profissional', 'hidratante', 'vegano', 'concentrado'],
    skinTypes: ['seco', 'danificado'],
    concerns: ['hidratacao', 'frizz', 'danos'],
    ingredients: ['Argan Oil', 'Silk Protein', 'Panthenol', 'Hydrolyzed Keratin'],
  },
  {
    name: 'Shampoo Matizador Silver Purple 500ml',
    slug: 'shampoo-matizador-silver-purple-500ml',
    description: `Shampoo matizador profissional para cabelos loiros, grisalhos e com luzes. Neutraliza tons amarelados e alaranjados.

Tecnologia:
- Pigmentos violeta de alta performance
- Neutraliza amarelado e alaranjado
- Realça tons prateados e acinzentados
- Hidrata enquanto matiza
- Não mancha a pele

Modo de uso profissional:
Aplicar nos cabelos molhados, massagear e deixar agir 3-10 minutos conforme intensidade desejada. Enxaguar.

Para cabelos descoloridos, platinados, grisalhos ou com luzes.`,
    brand: 'Truss',
    categorySlug: 'shampoos',
    price: 68.90,
    stock: 40,
    condition: 'NEW',
    images: ['/images/products/shampoo-matizador-1.jpg'],
    tags: ['matizador', 'profissional', 'loiros', 'grisalhos'],
    concerns: ['amarelado', 'matizar'],
  },
  {
    name: 'Shampoo Anti-Resíduos Deep Clean 1L',
    slug: 'shampoo-anti-residuos-deep-clean-1l',
    description: `Shampoo de limpeza profunda que remove resíduos de produtos, poluição e oleosidade. Preparação perfeita para tratamentos químicos.

Benefícios:
- Limpeza profunda
- Remove resíduos de silicones e produtos
- Desintoxica o couro cabeludo
- Prepara para química (alisamentos, coloração)
- Sensação de cabelo leve

Modo de uso:
Aplicar 1-2x por semana ou antes de químicas. Massagear e enxaguar.

Após uso, sempre hidratar os cabelos.`,
    brand: 'Wella',
    categorySlug: 'shampoos',
    price: 52.90,
    stock: 50,
    condition: 'NEW',
    images: ['/images/products/shampoo-wella-1.jpg'],
    tags: ['anti-residuo', 'limpeza-profunda', 'profissional'],
  },

  // CABELO - Condicionadores e Máscaras (4 produtos)
  {
    name: 'Máscara Capilar Reconstrutora Nano Repair 500g',
    slug: 'mascara-capilar-reconstrutora-nano-repair-500g',
    description: `Máscara de tratamento intensivo com nanotecnologia. Reconstrói fibra capilar profundamente danificada. Resultado desde a primeira aplicação.

Tecnologia Nano Repair:
Partículas nanométricas penetram profundamente na fibra capilar, reconstruindo de dentro para fora.

Benefícios:
- Reconstrução profunda
- Restaura a massa capilar
- Reduz quebra em até 95%
- Sela cutículas
- Brilho intenso
- Maciez extrema

Complexo de ativos:
- Nano Queratina Vegetal
- Colágeno Hidrolisado
- Aminoácidos Essenciais
- Ácido Hialurônico
- Manteiga de Karité

Para cabelos muito danificados, química excessiva, uso frequente de calor.`,
    brand: 'Forever Liss',
    categorySlug: 'condicionadores',
    price: 79.90,
    compareAtPrice: 119.90,
    stock: 55,
    condition: 'NEW',
    images: ['/images/products/mascara-forever-liss-1.jpg'],
    tags: ['profissional', 'reconstrutor', 'nanotecnologia', 'tratamento-intensivo'],
    skinTypes: ['muito-seco', 'danificado'],
    concerns: ['reconstrucao', 'quebra', 'danos-quimicos'],
    ingredients: ['Nano Keratin', 'Collagen', 'Amino Acids', 'Hyaluronic Acid', 'Shea Butter'],
  },
  {
    name: 'Condicionador Profissional Hidratante 1L',
    slug: 'condicionador-profissional-hidratante-1l',
    description: `Condicionador profissional que desembaraça, hidrata e sela as cutículas. Uso diário em salões.

Benefícios:
- Desembaraça instantaneamente
- Hidratação leve
- Facilita penteado
- Brilho natural
- Controle de frizz

Ideal para uso diário após shampoo. Rende 30-40 aplicações profissionais.`,
    brand: 'Salon Line',
    categorySlug: 'condicionadores',
    price: 42.90,
    stock: 70,
    condition: 'NEW',
    images: ['/images/products/condicionador-salon-line-1.jpg'],
    tags: ['profissional', 'hidratante', 'uso-diario'],
  },
  {
    name: 'Ampola de Tratamento Capilar Intensivo 15ml (caixa com 6)',
    slug: 'ampola-tratamento-capilar-intensivo-caixa-6',
    description: `Caixa com 6 ampolas de tratamento intensivo. Concentrado de ativos para recuperação express de cabelos danificados.

Tratamento:
- 1 ampola por aplicação
- Resultado imediato
- Hidratação, reconstrução e nutrição em dose única
- Ideal para tratamento de choque

Modo de uso:
Lavar cabelo, aplicar ampola mecha por mecha, massagear, deixar 10-15 min, enxaguar.

Protocolo sugerido: 1 ampola por semana durante 6 semanas.`,
    brand: 'L\'Oréal Professionnel',
    categorySlug: 'tratamentos-capilares',
    price: 129.90,
    compareAtPrice: 189.90,
    stock: 30,
    condition: 'NEW',
    images: ['/images/products/ampola-loreal-1.jpg'],
    tags: ['tratamento-intensivo', 'ampola', 'profissional', 'resultado-imediato'],
  },
  {
    name: 'Leave-in Multifuncional 10 em 1 - 200ml',
    slug: 'leave-in-multifuncional-10-em-1',
    description: `Leave-in sem enxágue com 10 benefícios em um único produto. Uso profissional e home care.

10 Benefícios:
1. Desembaraça
2. Controla frizz
3. Proteção térmica
4. Brilho intenso
5. Maciez
6. Facilita escovação
7. Sela pontas duplas
8. Protege cor
9. Reduz volume
10. Efeito anti-poluição

Aplicar em cabelos úmidos ou secos. Não enxaguar.`,
    brand: 'Kerastase',
    categorySlug: 'finalizadores',
    price: 189.90,
    stock: 35,
    condition: 'NEW',
    images: ['/images/products/leave-in-kerastase-1.jpg'],
    tags: ['leave-in', 'multifuncional', 'profissional'],
  },

  // CABELO - Finalizadores (3 produtos)
  {
    name: 'Finalizador Termo Protetor Spray 200ml',
    slug: 'finalizador-termo-protetor-spray-200ml',
    description: `Spray finalizador com proteção térmica até 230°C. Protege contra danos do calor de secador, chapinha e babyliss.

Proteção Professional:
- Barreira térmica até 230°C
- Previne ressecamento
- Reduz frizz
- Aumenta brilho
- Facilita escovação
- Não deixa resíduos

Tecnologia Heat Shield: cria escudo invisível protetor.
Para uso diário com ferramentas de calor.`,
    brand: 'Tresemmé',
    categorySlug: 'finalizadores',
    price: 42.90,
    stock: 70,
    condition: 'NEW',
    images: ['/images/products/termo-protetor-1.jpg'],
    tags: ['termo-protetor', 'spray', 'profissional', 'protecao-calor'],
    concerns: ['protecao-termica', 'frizz'],
    ingredients: ['Heat Shield Complex', 'Silicones', 'Vitamin E'],
  },
  {
    name: 'Óleo Capilar Finalizador Argan Marroquino 60ml',
    slug: 'oleo-capilar-finalizador-argan-marroquino',
    description: `Óleo capilar puro de argan marroquino. Finalizador que proporciona brilho intenso, controla frizz e sela pontas duplas.

Benefícios:
- Brilho intenso imediato
- Controle de frizz
- Sela pontas duplas
- Nutrição profunda
- Não pesa nos fios
- Perfume suave

Modo de uso:
Aplicar 2-3 gotas nas pontas e comprimento em cabelos úmidos ou secos.

100% óleo de argan puro, prensado a frio.`,
    brand: 'Moroccanoil',
    categorySlug: 'finalizadores',
    price: 219.90,
    stock: 25,
    condition: 'NEW',
    images: ['/images/products/oleo-argan-1.jpg'],
    tags: ['oleo', 'argan', 'profissional', 'brilho'],
  },
  {
    name: 'Sérum Anti-Frizz Efeito Liso 50ml',
    slug: 'serum-anti-frizz-efeito-liso',
    description: `Sérum potente anti-frizz que controla volume e proporciona efeito liso natural. Longa duração mesmo em clima úmido.

Tecnologia:
- Controle de frizz até 72h
- Efeito anti-umidade
- Não pesa
- Brilho natural
- Proteção térmica

Ideal para:
- Cabelos rebeldes e volumosos
- Dias úmidos
- Pós-escova profissional

Aplicar pequena quantidade em cabelos úmidos ou secos.`,
    brand: 'John Frieda',
    categorySlug: 'finalizadores',
    price: 89.90,
    stock: 45,
    condition: 'NEW',
    images: ['/images/products/serum-john-frieda-1.jpg'],
    tags: ['anti-frizz', 'serum', 'controle-volume'],
  },

  // SKINCARE - Séruns (4 produtos)
  {
    name: 'Sérum Facial Vitamina C 20% + Ácido Hialurônico 30ml',
    slug: 'serum-facial-vitamina-c-20-acido-hialuronico-30ml',
    description: `Sérum potente com Vitamina C pura (L-Ascorbic Acid) 20% e Ácido Hialurônico. Clareia manchas, uniformiza tom e ilumina a pele.

Fórmula Profissional:
- Vitamina C 20% (L-Ascorbic Acid estabilizada)
- Ácido Hialurônico de 3 pesos moleculares
- Vitamina E (antioxidante)
- Ácido Ferúlico (potencializador)

Benefícios comprovados:
- Clareia manchas em 4 semanas
- Uniformiza tom da pele
- Estimula produção de colágeno
- Ação antioxidante potente
- Hidratação profunda
- Previne envelhecimento precoce

pH: 3.5 (ideal para absorção da Vitamina C)

Usar protetor solar durante o dia (FPS 30+).
Dermatologicamente testado. Hipoalergênico. Não comedogênico.`,
    brand: 'The Ordinary',
    categorySlug: 'serums',
    price: 159.90,
    compareAtPrice: 229.90,
    stock: 40,
    condition: 'NEW',
    images: ['/images/products/serum-vitamina-c-1.jpg'],
    tags: ['profissional', 'vitamina-c', 'clareador', 'anti-idade', 'dermatologico'],
    skinTypes: ['todos'],
    concerns: ['manchas', 'uniformizar', 'anti-idade', 'luminosidade'],
    ingredients: ['L-Ascorbic Acid 20%', 'Hyaluronic Acid', 'Vitamin E', 'Ferulic Acid'],
  },
  {
    name: 'Sérum Facial Niacinamida 10% + Zinco 1% - 30ml',
    slug: 'serum-facial-niacinamida-10-zinco-1-30ml',
    description: `Sérum com alta concentração de Niacinamida para controle de oleosidade, redução de poros e uniformização da pele.

Fórmula:
- Niacinamida 10% (Vitamina B3)
- Zinco 1%

Benefícios:
- Controla oleosidade
- Minimiza aparência dos poros
- Uniformiza tom da pele
- Reduz vermelhidão
- Previne acne
- Clareia manchas

Ideal para:
- Pele oleosa e acneica
- Poros dilatados
- Manchas pós-acne

Usar 2x ao dia, manhã e noite.
Pode ser combinado com outros séruns.`,
    brand: 'The Ordinary',
    categorySlug: 'serums',
    price: 129.90,
    stock: 50,
    condition: 'NEW',
    images: ['/images/products/serum-niacinamida-1.jpg'],
    tags: ['niacinamida', 'controle-oleosidade', 'poros'],
    skinTypes: ['oleosa', 'acneica'],
    concerns: ['oleosidade', 'poros', 'manchas', 'acne'],
  },
  {
    name: 'Sérum Facial Ácido Hialurônico Puro 2% - 30ml',
    slug: 'serum-facial-acido-hialuronico-puro-2-30ml',
    description: `Sérum hidratante com Ácido Hialurônico puro em 3 pesos moleculares. Hidratação profunda e efeito preenchedor.

Tecnologia:
- Ácido Hialurônico de 3 pesos moleculares
- Penetração em camadas profundas
- Efeito preenchedor

Benefícios:
- Hidratação intensa e prolongada
- Preenche linhas finas
- Pele mais firme e elástica
- Efeito plumping
- Prepara pele para hidratante

Para todos os tipos de pele.
Usar 2x ao dia antes do hidratante.`,
    brand: 'La Roche-Posay',
    categorySlug: 'serums',
    price: 179.90,
    stock: 35,
    condition: 'NEW',
    images: ['/images/products/serum-acido-hialuronico-1.jpg'],
    tags: ['acido-hialuronico', 'hidratante', 'anti-idade'],
    skinTypes: ['todos'],
    concerns: ['desidratacao', 'linhas-finas', 'anti-idade'],
  },
  {
    name: 'Sérum Facial Retinol 1% + Ácido Hialurônico - 30ml',
    slug: 'serum-facial-retinol-1-acido-hialuronico-30ml',
    description: `Sérum anti-idade com Retinol 1% de liberação gradual. Reduz rugas, linhas de expressão e melhora textura da pele.

Fórmula:
- Retinol 1% (time-release)
- Ácido Hialurônico
- Vitamina E

Benefícios:
- Reduz rugas e linhas de expressão
- Melhora textura da pele
- Uniformiza tom
- Estimula renovação celular
- Aumenta produção de colágeno

Modo de uso:
Aplicar à noite, 2-3x por semana inicialmente. Aumentar frequência gradualmente.
SEMPRE usar protetor solar durante o dia.

Para pele com sinais de envelhecimento.`,
    brand: 'CeraVe',
    categorySlug: 'serums',
    price: 149.90,
    stock: 30,
    condition: 'NEW',
    images: ['/images/products/serum-retinol-1.jpg'],
    tags: ['retinol', 'anti-idade', 'rugas'],
    skinTypes: ['normal', 'seca', 'mista'],
    concerns: ['rugas', 'anti-idade', 'textura'],
  },

  // SKINCARE - Proteção Solar (2 produtos)
  {
    name: 'Protetor Solar Facial FPS 70 Color Nude 50ml',
    slug: 'protetor-solar-facial-fps-70-color-nude-50ml',
    description: `Protetor solar facial com cor e alta proteção FPS 70. Acabamento natural, cobertura leve e proteção UVA/UVB de amplo espectro.

Proteção Total:
- FPS 70 / PPD 38
- Proteção UVA/UVB
- Luz azul e infravermelho
- Resistente à água (40 min)

Benefícios:
- Cobertura leve e natural
- Disfarça imperfeições
- Controle de oleosidade
- Toque seco
- Não comedogênico
- Pode substituir base leve

Ativos complementares:
- Niacinamida (uniformiza tom)
- Vitamina E (antioxidante)
- Silício (toque seco)

Modo de uso:
Aplicar generosamente 30 minutos antes da exposição solar. Reaplicar a cada 2 horas.

Ideal para uso diário, peles oleosas a mistas.
Livre de parabenos, fragrância, oxibenzona.`,
    brand: 'Isdin',
    categorySlug: 'protecao-solar',
    price: 119.90,
    stock: 50,
    condition: 'NEW',
    images: ['/images/products/protetor-isdin-1.jpg'],
    tags: ['fps-70', 'com-cor', 'toque-seco', 'dermatologico', 'profissional'],
    skinTypes: ['oleosa', 'mista', 'todos'],
    concerns: ['protecao-solar', 'manchas', 'anti-idade'],
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Niacinamide', 'Vitamin E'],
  },
  {
    name: 'Protetor Solar Corporal FPS 50 - 200ml',
    slug: 'protetor-solar-corporal-fps-50-200ml',
    description: `Protetor solar corporal de alta proteção FPS 50. Textura leve, rápida absorção, resistente à água.

Proteção:
- FPS 50
- Proteção UVA/UVB
- Resistente à água e suor (80 min)

Características:
- Textura fluida
- Rápida absorção
- Não deixa pele oleosa
- Não mancha roupa
- Ideal para toda família

Para pele corporal.
Reaplicar a cada 2-3 horas ou após nadar.`,
    brand: 'La Roche-Posay',
    categorySlug: 'protecao-solar',
    price: 149.90,
    stock: 45,
    condition: 'NEW',
    images: ['/images/products/protetor-corporal-1.jpg'],
    tags: ['fps-50', 'corporal', 'resistente-agua'],
  },

  // SKINCARE - Máscaras e Tratamentos (3 produtos)
  {
    name: 'Máscara Facial Argila Preta Detox 100g',
    slug: 'mascara-facial-argila-preta-detox-100g',
    description: `Máscara de argila preta purificante. Remove impurezas profundas, controla oleosidade e minimiza poros.

Argila Preta Vulcânica:
Minerais naturais com alto poder de absorção de oleosidade e impurezas.

Benefícios:
- Limpeza profunda dos poros
- Remove cravos e pontos pretos
- Controla oleosidade
- Minimiza aparência dos poros
- Uniformiza textura da pele
- Efeito matte prolongado

Ativos adicionais:
- Carvão Ativado (detox)
- Niacinamida (controle de sebo)
- Extrato de Hamamélis (adstringente)
- Ácido Salicílico 1%

Modo de uso:
Aplicar camada fina, deixar 10-15 minutos, enxaguar.
Usar 1-2x por semana.

Ideal para pele oleosa, acneica, poros dilatados.
Dermatologicamente testado.`,
    brand: 'L\'Oréal Paris',
    categorySlug: 'mascaras-faciais',
    price: 54.90,
    stock: 65,
    condition: 'NEW',
    images: ['/images/products/mascara-argila-1.jpg'],
    tags: ['purificante', 'detox', 'argila', 'dermatologico'],
    skinTypes: ['oleosa', 'acneica', 'mista'],
    concerns: ['poros', 'cravos', 'oleosidade', 'acne'],
    ingredients: ['Black Clay', 'Activated Charcoal', 'Niacinamide', 'Witch Hazel', 'Salicylic Acid 1%'],
  },
  {
    name: 'Máscara Facial Hidratante Overnight 50ml',
    slug: 'mascara-facial-hidratante-overnight-50ml',
    description: `Máscara hidratante noturna que age enquanto você dorme. Pele intensamente hidratada, macia e radiante pela manhã.

Tecnologia Overnight:
Liberação gradual de ativos durante a noite para máxima absorção.

Benefícios:
- Hidratação intensa por 24h
- Restaura barreira cutânea
- Reduz desidratação noturna
- Pele radiante ao acordar
- Textura gel-creme

Ativos:
- Ácido Hialurônico
- Niacinamida
- Ceramidas
- Extratos botânicos calmantes

Modo de uso:
Aplicar à noite como último passo da rotina. Não enxaguar.

Para todos os tipos de pele.`,
    brand: 'Neutrogena',
    categorySlug: 'mascaras-faciais',
    price: 89.90,
    stock: 40,
    condition: 'NEW',
    images: ['/images/products/mascara-overnight-1.jpg'],
    tags: ['hidratante', 'overnight', 'noturna'],
  },
  {
    name: 'Kit 5 Sheet Masks Hidratantes Variadas',
    slug: 'kit-5-sheet-masks-hidratantes-variadas',
    description: `Kit com 5 máscaras faciais em tecido (sheet masks) com diferentes ativos hidratantes e tratantes.

Composição do kit:
1. Ácido Hialurônico - hidratação profunda
2. Colágeno - firmeza
3. Vitamina C - luminosidade
4. Chá Verde - calmante
5. Aloe Vera - refrescante

Cada máscara:
- Tecido de fibra natural
- Essência concentrada
- Uso único
- 20 minutos de aplicação
- Resultado imediato

Modo de uso:
Limpar rosto, aplicar máscara, deixar 15-20min, remover e massagear excesso.

Uso: 1-2x por semana ou sempre que precisar de hidratação extra.`,
    brand: 'Garnier',
    categorySlug: 'mascaras-faciais',
    price: 64.90,
    stock: 55,
    condition: 'NEW',
    images: ['/images/products/sheet-masks-1.jpg'],
    tags: ['sheet-mask', 'hidratante', 'kit', 'pratico'],
  },

  // UNHAS - Esmaltes Gel (4 produtos)
  {
    name: 'Esmalte Gel UV LED 3 em 1 - Rosa Quartzo 8ml',
    slug: 'esmalte-gel-uv-led-3-em-1-rosa-quartzo-8ml',
    description: `Esmalte em gel 3 em 1 (base, cor e top coat). Alta cobertura e brilho intenso. Durabilidade de até 21 dias.

Sistema 3 em 1:
Dispensa base e top coat separados, economiza tempo no atendimento.

Características:
- Cobertura total em 2 camadas
- Brilho de top coat incorporado
- Cura rápida (30s LED / 2min UV)
- Não lasca nem descasca
- Remoção fácil
- Livre de formaldeído, tolueno e DBP

Durabilidade: até 21 dias com aplicação correta.

Rosa Quartzo: Tom nude rosado universal, elegante e atemporal.

Rendimento: aproximadamente 50-60 aplicações completas.`,
    brand: 'Risqué',
    categorySlug: 'gel-uv',
    price: 24.90,
    stock: 100,
    condition: 'NEW',
    images: ['/images/products/esmalte-gel-risque-1.jpg'],
    tags: ['gel', 'profissional', '3-em-1', 'longa-duracao', 'facil-aplicacao'],
  },
  {
    name: 'Esmalte Gel UV LED - Vermelho Intenso 8ml',
    slug: 'esmalte-gel-uv-led-vermelho-intenso-8ml',
    description: `Esmalte em gel profissional cor vermelha intensa. Alta pigmentação, cobertura em 2 camadas, brilho diamante.

Características:
- Cor vibrante e intensa
- Cobertura total em 2 camadas
- Brilho intenso
- Cura: 30s LED / 2min UV
- Durabilidade: 15-21 dias

Cor: Vermelho intenso clássico, elegante e atemporal.

Profissional para salões e manicures.`,
    brand: 'Risqué',
    categorySlug: 'gel-uv',
    price: 22.90,
    stock: 90,
    condition: 'NEW',
    images: ['/images/products/esmalte-gel-vermelho-1.jpg'],
    tags: ['gel', 'profissional', 'vermelho', 'classico'],
  },
  {
    name: 'Base Coat Gel UV LED - Fortificante 15ml',
    slug: 'base-coat-gel-uv-led-fortificante-15ml',
    description: `Base coat em gel profissional. Prepara e fortalece unhas, aumenta aderência do esmalte gel.

Benefícios:
- Aumenta aderência
- Fortalece unhas fracas
- Previne descamação
- Base perfeita para cor
- Cura rápida: 30s LED / 2min UV

Modo de uso:
Aplicar camada fina em unhas preparadas e desidratadas. Curar. Aplicar esmalte gel.

Essencial para aplicação profissional de esmalte gel.`,
    brand: 'OPI',
    categorySlug: 'gel-uv',
    price: 89.90,
    stock: 40,
    condition: 'NEW',
    images: ['/images/products/base-coat-gel-1.jpg'],
    tags: ['base-coat', 'gel', 'profissional', 'fortificante'],
  },
  {
    name: 'Top Coat Gel UV LED - Ultra Brilho 15ml',
    slug: 'top-coat-gel-uv-led-ultra-brilho-15ml',
    description: `Top coat em gel profissional. Finalização com brilho intenso tipo diamante. Proteção e durabilidade.

Benefícios:
- Brilho intenso e duradouro
- Protege a cor
- Aumenta durabilidade
- Não amarela
- Cura rápida: 30s LED / 2min UV

Modo de uso:
Aplicar camada fina sobre esmalte gel curado. Curar. Limpar camada pegajosa.

Essencial para finalização profissional.`,
    brand: 'OPI',
    categorySlug: 'gel-uv',
    price: 94.90,
    stock: 45,
    condition: 'NEW',
    images: ['/images/products/top-coat-gel-1.jpg'],
    tags: ['top-coat', 'gel', 'profissional', 'brilho'],
  },

  // UNHAS - Ferramentas (2 produtos)
  {
    name: 'Kit Profissional de Alicate e Ferramentas para Manicure 7 Peças',
    slug: 'kit-profissional-alicate-ferramentas-manicure-7-pecas',
    description: `Kit completo de ferramentas profissionais em aço inoxidável. Qualidade cirúrgica, esterilizável em autoclave.

Composição do kit:
1. Alicate de Cutícula Profissional (12cm)
2. Alicate de Unha Reta (11cm)
3. Alicate de Unha Curva (10cm)
4. Espátula Dupla (Empurrador de Cutícula)
5. Palito em Aço (Limpeza de Cutículas)
6. Lixa de Metal Dupla Face
7. Estojo em Couro Sintético

Qualidade Profissional:
- Aço inoxidável cirúrgico 420
- Corte preciso e afiado
- Molas de longa duração
- Acabamento polido
- Esterilizável em autoclave

Durabilidade: 3-5 anos de uso profissional intenso com manutenção adequada.

Garantia: 12 meses contra defeitos de fabricação.
Certificações: ANVISA / ISO 9001`,
    brand: 'Mundial',
    categorySlug: 'ferramentas-unhas',
    price: 189.90,
    compareAtPrice: 279.90,
    stock: 35,
    condition: 'NEW',
    images: ['/images/products/kit-alicate-mundial-1.jpg'],
    tags: ['profissional', 'aco-inoxidavel', 'esterilizavel', 'duravel', 'kit-completo'],
  },
  {
    name: 'Lixa Elétrica para Unhas Profissional',
    slug: 'lixa-eletrica-para-unhas-profissional',
    description: `Lixa elétrica profissional para unhas. Motor potente, velocidade ajustável, para unhas naturais e em gel.

Especificações:
- Motor profissional 35.000 RPM
- 6 velocidades ajustáveis
- Sentido de rotação reversível
- Baixa vibração
- Silenciosa

Acessórios inclusos:
- 6 brocas profissionais (lixamento, polimento, remoção gel)
- Pedal de controle
- Suporte para brocas

Ideal para:
- Manicures profissionais
- Salões de beleza
- Nail designers
- Preparação de unhas para alongamento
- Remoção de gel e acrigel

Voltagem: Bivolt automático
Garantia: 12 meses`,
    brand: 'Melhores Artigos Professional',
    categorySlug: 'ferramentas-unhas',
    price: 349.90,
    compareAtPrice: 499.90,
    stock: 20,
    condition: 'NEW',
    images: ['/images/products/lixa-eletrica-1.jpg'],
    tags: ['lixa-eletrica', 'profissional', 'motor-potente', 'salao'],
  },

  // EQUIPAMENTOS (4 produtos)
  {
    name: 'Secador Profissional Ionic 2200W Motor AC',
    slug: 'secador-profissional-ionic-2200w-motor-ac',
    description: `Secador profissional de alta performance. Motor AC de longa duração, tecnologia iônica e 2200W de potência real.

Motor AC Profissional:
Motor de corrente alternada, usado em equipamentos profissionais. Vida útil de 2000+ horas (cerca de 5 anos de uso intenso).

Tecnologia Ionic:
Libera íons negativos que selam cutículas, reduzem frizz e aumentam o brilho.

Especificações técnicas:
- Potência: 2200W real
- Velocidades: 2
- Temperaturas: 3 (frio, morno, quente)
- Jato frio: Botão independente
- Voltagem: Bivolt automático
- Peso: 560g (leve)
- Cabo: 3 metros profissional
- Ruído: 75dB (baixo)

Acessórios:
- Bico concentrador removível
- Difusor para cachos
- Filtro removível

Garantia: 12 meses (uso profissional)
Certificações: INMETRO / CE`,
    brand: 'Taiff',
    categorySlug: 'secadores',
    price: 389.90,
    compareAtPrice: 549.90,
    stock: 20,
    condition: 'NEW',
    images: ['/images/products/secador-taiff-1.jpg'],
    tags: ['profissional', 'motor-ac', 'ionic', 'duravel', 'salao'],
  },
  {
    name: 'Chapinha Profissional Titanium 230°C',
    slug: 'chapinha-profissional-titanium-230c',
    description: `Chapinha profissional com placas de titanium. Aquecimento rápido, temperatura ajustável até 230°C, display digital.

Tecnologia:
- Placas 100% Titanium
- Aquecimento em 30 segundos
- Temperatura ajustável: 150°C a 230°C
- Display digital LED
- Controle preciso de temperatura

Características:
- Placas flutuantes (adaptam à mecha)
- Alisamento em uma passada
- Reduz danos térmicos
- Cabo giratório 360°
- Bivolt automático

Dimensões das placas:
- Largura: 3cm
- Comprimento: 11cm
- Ideal para todos os comprimentos

Para uso profissional intenso em salões.
Garantia: 12 meses`,
    brand: 'Babyliss Pro',
    categorySlug: 'chapinhas',
    price: 549.90,
    compareAtPrice: 799.90,
    stock: 15,
    condition: 'NEW',
    images: ['/images/products/chapinha-babyliss-1.jpg'],
    tags: ['chapinha', 'profissional', 'titanium', 'salao'],
  },
  {
    name: 'Cabine UV LED 54W Profissional - Sun 5 Plus',
    slug: 'cabine-uv-led-54w-profissional-sun-5-plus',
    description: `Cabine UV LED profissional de 54W. Tecnologia dual (UV+LED) cura todos os tipos de gel. Design ergonômico e sensor automático.

Tecnologia Dual:
36 lâmpadas de LED + UV garantem cura rápida e uniforme de qualquer gel ou base.

Potência e Eficiência:
- 54W reais de potência
- Cura em 10-60 segundos
- Compatível com todos os géis
- Luz uniforme em todos os ângulos
- Sem pontos de sombra

Recursos profissionais:
- Sensor automático (liga ao colocar a mão)
- Timer inteligente (10s, 30s, 60s, 99s)
- Display LED digital
- Base removível (para pedicure)
- Refletor interno espelhado

Dimensões:
- 22cm (L) x 20cm (P) x 10cm (A)
- Peso: 580g
- Bivolt automático

Vida útil das lâmpadas: 50.000 horas (não precisa trocar).

Garantia: 12 meses
Certificações: ANATEL / INMETRO / CE`,
    brand: 'Sun',
    categorySlug: 'cabines-uv',
    price: 349.90,
    compareAtPrice: 499.90,
    stock: 25,
    condition: 'NEW',
    images: ['/images/products/cabine-sun5-1.jpg'],
    tags: ['profissional', 'uv-led', 'dual', 'sensor', 'salao', 'manicure'],
  },
  {
    name: 'Vaporizador Facial Profissional com Ozônio',
    slug: 'vaporizador-facial-profissional-ozon io',
    description: `Vaporizador facial profissional com função ozônio. Ideal para limpeza de pele e tratamentos faciais em estética.

Recursos:
- Vapor quente contínuo
- Função ozônio (bactericida)
- Braço articulado ajustável
- Reservatório: 1 litro
- Aquecimento rápido (8-10 min)
- Timer automático

Benefícios do vapor:
- Abre os poros
- Facilita extração de cravos
- Prepara pele para tratamentos
- Aumenta absorção de ativos

Função Ozônio:
- Ação bactericida
- Ideal para pele acneica
- Purifica e desinfeta

Dimensões:
- Altura ajustável
- Rodízios para mobilidade
- Base estável

Ideal para:
- Clínicas de estética
- Salões de beleza
- Esteticistas autônomas
- Limpeza de pele profissional

Voltagem: 127V ou 220V (especificar)
Garantia: 12 meses`,
    brand: 'Tonederm',
    categorySlug: 'vaporizadores',
    price: 449.90,
    stock: 12,
    condition: 'NEW',
    images: ['/images/products/vaporizador-1.jpg'],
    tags: ['vaporizador', 'profissional', 'estetica', 'ozonio'],
  },
];
