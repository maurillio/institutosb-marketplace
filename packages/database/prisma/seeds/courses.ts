export interface CourseSeed {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  price: number;
  compareAtPrice?: number;
  thumbnail: string;
  duration: number; // em minutos
  modules: {
    title: string;
    description?: string;
    order: number;
    lessons: {
      title: string;
      description?: string;
      order: number;
      duration: number;
      isFree?: boolean;
    }[];
  }[];
}

export const coursesData: CourseSeed[] = [
  // 1. Maquiagem Profissional
  {
    title: 'Maquiagem Profissional do Básico ao Avançado',
    slug: 'maquiagem-profissional-basico-avancado',
    description: `Curso completo de maquiagem profissional. Aprenda desde os conceitos básicos até técnicas avançadas de maquiagem para eventos, noivas, editorial e artística.

O que você vai aprender:
- Visagismo e análise de rosto
- Teoria das cores aplicada
- Preparação de pele perfeita
- Técnicas de contorno e iluminação
- Maquiagem para diferentes ocasiões
- Maquiagem de noiva (natural e clássica)
- Maquiagem editorial e artística
- Fotografia e iluminação
- Como montar kit profissional
- Precificação e atendimento ao cliente

Metodologia:
Aulas teóricas + práticas com modelos reais. Feedback individual em cada aula prática.

Certificado:
Digital e impresso, reconhecido nacionalmente.

Requisitos:
Nenhum. Curso para iniciantes e intermediários.

Material necessário:
Lista completa fornecida na primeira aula. Kit básico inicial: R$ 300-500.`,
    shortDescription: 'Do zero ao profissional: técnicas, teoria e prática de maquiagem',
    type: 'ONLINE',
    level: 'ALL_LEVELS',
    price: 497.00,
    compareAtPrice: 897.00,
    thumbnail: '/images/courses/maquiagem-completo.jpg',
    duration: 1800, // 30 horas
    modules: [
      {
        title: 'Módulo 1: Fundamentos da Maquiagem',
        description: 'Conceitos básicos, ferramentas e produtos essenciais',
        order: 1,
        lessons: [
          {
            title: 'Bem-vindo ao curso',
            description: 'Apresentação do curso, metodologia e objetivos',
            order: 1,
            duration: 15,
            isFree: true,
          },
          {
            title: 'Tipos de pele e preparação',
            description: 'Como identificar tipos de pele e preparar para maquiagem',
            order: 2,
            duration: 45,
          },
          {
            title: 'Ferramentas essenciais',
            description: 'Pincéis, esponjas e ferramentas profissionais',
            order: 3,
            duration: 40,
          },
          {
            title: 'Teoria das cores aplicada',
            description: 'Círculo cromático e harmonização de cores',
            order: 4,
            duration: 50,
          },
        ],
      },
      {
        title: 'Módulo 2: Técnicas de Base e Correção',
        description: 'Pele perfeita com base, corretivo e pó',
        order: 2,
        lessons: [
          { title: 'Escolha e aplicação de primer', order: 1, duration: 35 },
          { title: 'Técnicas de aplicação de base', order: 2, duration: 45 },
          { title: 'Correção de olheiras e imperfeições', order: 3, duration: 40 },
          { title: 'Selagem e fixação', order: 4, duration: 30 },
        ],
      },
      {
        title: 'Módulo 3: Contorno e Iluminação',
        description: 'Técnicas de esculpir o rosto com luz e sombra',
        order: 3,
        lessons: [
          { title: 'Visagismo: análise de rosto', order: 1, duration: 50 },
          { title: 'Técnicas de contorno', order: 2, duration: 45 },
          { title: 'Iluminação estratégica', order: 3, duration: 40 },
          { title: 'Prática: contorno em diferentes formatos de rosto', order: 4, duration: 60 },
        ],
      },
      {
        title: 'Módulo 4: Olhos',
        description: 'Técnicas de sombra, esfumado e delineado',
        order: 4,
        lessons: [
          { title: 'Formatos de olhos e técnicas', order: 1, duration: 45 },
          { title: 'Esfumado perfeito', order: 2, duration: 50 },
          { title: 'Delineado e traços', order: 3, duration: 40 },
          { title: 'Cílios postiços', order: 4, duration: 35 },
        ],
      },
      {
        title: 'Módulo 5: Sobrancelhas',
        description: 'Design e preenchimento profissional',
        order: 5,
        lessons: [
          { title: 'Design de sobrancelhas', order: 1, duration: 45 },
          { title: 'Técnicas de preenchimento', order: 2, duration: 40 },
        ],
      },
      {
        title: 'Módulo 6: Boca',
        description: 'Lábios perfeitos e harmoniosos',
        order: 6,
        lessons: [
          { title: 'Contorno e preenchimento labial', order: 1, duration: 35 },
          { title: 'Técnicas de longa duração', order: 2, duration: 30 },
        ],
      },
      {
        title: 'Módulo 7: Maquiagem para Ocasiões',
        description: 'Dia, noite, festa e eventos especiais',
        order: 7,
        lessons: [
          { title: 'Maquiagem para o dia', order: 1, duration: 45 },
          { title: 'Maquiagem para festa e balada', order: 2, duration: 50 },
          { title: 'Maquiagem de formatura', order: 3, duration: 45 },
        ],
      },
      {
        title: 'Módulo 8: Maquiagem de Noiva',
        description: 'Especialização em noivas',
        order: 8,
        lessons: [
          { title: 'Consulta e prova de maquiagem', order: 1, duration: 40 },
          { title: 'Técnicas de longa duração para noivas', order: 2, duration: 50 },
          { title: 'Maquiagem de noiva: passo a passo completo', order: 3, duration: 90 },
        ],
      },
      {
        title: 'Módulo 9: Negócios e Carreira',
        description: 'Como se profissionalizar e ganhar dinheiro',
        order: 9,
        lessons: [
          { title: 'Montando seu kit profissional', order: 1, duration: 30 },
          { title: 'Precificação de serviços', order: 2, duration: 40 },
          { title: 'Marketing para maquiadores', order: 3, duration: 45 },
          { title: 'Atendimento ao cliente', order: 4, duration: 35 },
        ],
      },
    ],
  },

  // 2. Design de Sobrancelhas
  {
    title: 'Design de Sobrancelhas e Micropigmentação',
    slug: 'design-sobrancelhas-micropigmentacao',
    description: `Aprenda design de sobrancelhas com técnicas modernas + introdução à micropigmentação (henna, henna híbrida e conceitos de micro).

Conteúdo:
- Visagismo de sobrancelhas
- Medidas e proporções faciais
- Design com linha
- Técnicas de depilação (pinça, cera, linha)
- Colorimetria para sobrancelhas
- Henna tradicional e henna híbrida
- Conceitos de micropigmentação (Fio a Fio, Sombra, Ombre)
- Biossegurança e esterilização
- Marketing e precificação

Bônus:
- Aula de alongamento de cílios fio a fio
- Laminação de sobrancelhas
- Templates para contrato e ficha de anamnese

Certificado:
Reconhecido para atuação profissional.

Pré-requisitos:
Nenhum. Iniciantes podem fazer.

Material necessário:
Kit inicial: R$ 200-300 (lista fornecida)`,
    shortDescription: 'Design, henna e introdução à micropigmentação',
    type: 'ONLINE',
    level: 'BEGINNER',
    price: 397.00,
    compareAtPrice: 697.00,
    thumbnail: '/images/courses/design-sobrancelhas.jpg',
    duration: 900, // 15 horas
    modules: [
      {
        title: 'Módulo 1: Fundamentos',
        order: 1,
        lessons: [
          { title: 'Introdução ao curso', order: 1, duration: 15, isFree: true },
          { title: 'Anatomia da sobrancelha', order: 2, duration: 30 },
          { title: 'Visagismo aplicado', order: 3, duration: 45 },
          { title: 'Medidas e proporções', order: 4, duration: 50 },
        ],
      },
      {
        title: 'Módulo 2: Design',
        order: 2,
        lessons: [
          { title: 'Técnica do design com linha', order: 1, duration: 40 },
          { title: 'Depilação com pinça', order: 2, duration: 35 },
          { title: 'Depilação com cera', order: 3, duration: 30 },
          { title: 'Design com linha egípcia', order: 4, duration: 45 },
        ],
      },
      {
        title: 'Módulo 3: Colorimetria e Henna',
        order: 3,
        lessons: [
          { title: 'Teoria das cores para sobrancelhas', order: 1, duration: 40 },
          { title: 'Henna tradicional', order: 2, duration: 45 },
          { title: 'Henna híbrida', order: 3, duration: 50 },
        ],
      },
      {
        title: 'Módulo 4: Micropigmentação',
        order: 4,
        lessons: [
          { title: 'Conceitos de micropigmentação', order: 1, duration: 60 },
          { title: 'Técnicas: Fio a Fio, Shadow, Ombre', order: 2, duration: 70 },
          { title: 'Biossegurança e regulamentação', order: 3, duration: 40 },
        ],
      },
      {
        title: 'Módulo 5: Negócios',
        order: 5,
        lessons: [
          { title: 'Montando seu espaço', order: 1, duration: 30 },
          { title: 'Precificação', order: 2, duration: 35 },
          { title: 'Marketing no Instagram', order: 3, duration: 40 },
        ],
      },
    ],
  },

  // 3. Colorimetria Capilar
  {
    title: 'Colorimetria Capilar Avançada',
    slug: 'colorimetria-capilar-avancada',
    description: `Domine a arte da colorimetria capilar. Aprenda a criar nuances perfeitas, correções de cor, mechas e técnicas de descoloração seguras.

Programa completo:
- Teoria da cor aplicada ao cabelo
- Fundos de clareamento e pigmentos
- Neutralização de tons indesejados
- Técnicas de aplicação (raiz, comprimento, pontas)
- Coloração global, tonalização e correção de cor
- Técnicas de mechas (tradicionais e modernas)
- Ombre, balayage, babylights
- Descoloração segura
- Matização e toners
- Cuidados pós-cor
- Protocolos de reconstrução

Diferenciais:
- Fórmulas prontas para copiar
- Tabela de neutralização
- Receitas de misturas
- Casos práticos reais

Pré-requisitos:
Conhecimento básico de cabeleireiro (lavar, secar, escovar)

Certificado:
Profissionalizante`,
    shortDescription: 'Domine cores, mechas, balayage e correções',
    type: 'ONLINE',
    level: 'INTERMEDIATE',
    price: 897.00,
    thumbnail: '/images/courses/colorimetria.jpg',
    duration: 1200, // 20 horas
    modules: [
      {
        title: 'Módulo 1: Teoria da Cor',
        order: 1,
        lessons: [
          { title: 'Introdução à colorimetria', order: 1, duration: 20, isFree: true },
          { title: 'Círculo cromático capilar', order: 2, duration: 60 },
          { title: 'Fundos de clareamento', order: 3, duration: 60 },
          { title: 'Neutralização de tons', order: 4, duration: 50 },
        ],
      },
      {
        title: 'Módulo 2: Coloração Global',
        order: 2,
        lessons: [
          { title: 'Tipos de coloração', order: 1, duration: 45 },
          { title: 'Técnicas de aplicação', order: 2, duration: 60 },
          { title: 'Prática: coloração global', order: 3, duration: 90 },
        ],
      },
      {
        title: 'Módulo 3: Descoloração',
        order: 3,
        lessons: [
          { title: 'Descoloração segura', order: 1, duration: 60 },
          { title: 'Pó descolorante e oxidantes', order: 2, duration: 45 },
          { title: 'Prática: descoloração', order: 3, duration: 80 },
        ],
      },
      {
        title: 'Módulo 4: Técnicas de Mechas',
        order: 4,
        lessons: [
          { title: 'Mechas tradicionais', order: 1, duration: 60 },
          { title: 'Balayage', order: 2, duration: 70 },
          { title: 'Ombre e Sombre', order: 3, duration: 60 },
          { title: 'Babylights', order: 4, duration: 50 },
        ],
      },
      {
        title: 'Módulo 5: Matização e Tonalização',
        order: 5,
        lessons: [
          { title: 'Matização de loiros', order: 1, duration: 50 },
          { title: 'Toners e gloss', order: 2, duration: 45 },
          { title: 'Correção de cor', order: 3, duration: 70 },
        ],
      },
      {
        title: 'Módulo 6: Negócios',
        order: 6,
        lessons: [
          { title: 'Precificação de serviços de cor', order: 1, duration: 40 },
          { title: 'Ficha técnica e anamnese', order: 2, duration: 30 },
        ],
      },
    ],
  },

  // 4. Skincare Profissional
  {
    title: 'Skincare Profissional e Tratamentos Faciais',
    slug: 'skincare-profissional-tratamentos-faciais',
    description: `Aprenda a realizar tratamentos faciais profissionais, limpeza de pele completa, e protocolos de tratamento para diferentes necessidades.

Conteúdo:
- Anatomia e fisiologia da pele
- Tipos de pele e suas necessidades
- Protocolos de limpeza de pele profunda
- Extração de comedões (técnicas corretas)
- Máscas faciais e seus benefícios
- Massagem facial (drenagem e relaxante)
- Peeling superficial
- Tratamentos anti-idade
- Hidratação profunda
- Acne: causas e tratamentos
- Manchas e hiperpigmentação
- Biossegurança e esterilização
- Ficha de anamnese e avaliação de pele

Ideal para:
- Esteticistas iniciantes
- Profissionais de beleza que querem agregar serviço
- Empreendedoras que querem trabalhar em casa

Certificado:
Profissionalizante reconhecido`,
    shortDescription: 'Limpeza de pele, tratamentos e protocolos faciais',
    type: 'ONLINE',
    level: 'BEGINNER',
    price: 547.00,
    thumbnail: '/images/courses/skincare-profissional.jpg',
    duration: 720, // 12 horas
    modules: [
      {
        title: 'Módulo 1: Fundamentos da Pele',
        order: 1,
        lessons: [
          { title: 'Bem-vindo ao curso de skincare', order: 1, duration: 15, isFree: true },
          { title: 'Anatomia e fisiologia da pele', order: 2, duration: 50 },
          { title: 'Tipos de pele', order: 3, duration: 40 },
          { title: 'Análise e avaliação de pele', order: 4, duration: 45 },
        ],
      },
      {
        title: 'Módulo 2: Limpeza de Pele',
        order: 2,
        lessons: [
          { title: 'Protocolo completo de limpeza de pele', order: 1, duration: 60 },
          { title: 'Técnicas de extração seguras', order: 2, duration: 50 },
          { title: 'Máscaras faciais', order: 3, duration: 40 },
        ],
      },
      {
        title: 'Módulo 3: Tratamentos Específicos',
        order: 3,
        lessons: [
          { title: 'Tratamento anti-idade', order: 1, duration: 50 },
          { title: 'Tratamento para acne', order: 2, duration: 55 },
          { title: 'Tratamento de manchas', order: 3, duration: 45 },
          { title: 'Hidratação profunda', order: 4, duration: 40 },
        ],
      },
      {
        title: 'Módulo 4: Técnicas Avançadas',
        order: 4,
        lessons: [
          { title: 'Massagem facial', order: 1, duration: 45 },
          { title: 'Peeling superficial', order: 2, duration: 50 },
          { title: 'Alta frequência', order: 3, duration: 35 },
        ],
      },
      {
        title: 'Módulo 5: Negócios',
        order: 5,
        lessons: [
          { title: 'Montando seu espaço de estética', order: 1, duration: 35 },
          { title: 'Precificação de tratamentos', order: 2, duration: 30 },
          { title: 'Biossegurança e regulamentação', order: 3, duration: 40 },
        ],
      },
    ],
  },

  // 5. Nail Art
  {
    title: 'Nail Art Avançado - Técnicas e Decoração',
    slug: 'nail-art-avancado-tecnicas-decoracao',
    description: `Curso completo de Nail Art. Aprenda técnicas de decoração artística em unhas, desde o básico até designs complexos.

Conteúdo:
- Preparação de unhas para nail art
- Técnicas de pintura à mão livre
- Uso de pincéis específicos
- Decoração com adesivos e acessórios
- Técnicas de degradê e ombré
- Francesinha criativa
- Nail art com carimbo
- Efeitos especiais (mármore, craquelado, etc)
- Pedrarias e aplicações 3D
- Encapsulamento
- Tendências de mercado
- Portfólio e precificação

Material necessário:
Kit básico de nail art fornecido (incluso no curso presencial)

Certificado:
Profissionalizante`,
    shortDescription: 'Decore unhas como uma artista profissional',
    type: 'ONLINE',
    level: 'INTERMEDIATE',
    price: 447.00,
    thumbnail: '/images/courses/nail-art.jpg',
    duration: 600, // 10 horas
    modules: [
      {
        title: 'Módulo 1: Fundamentos',
        order: 1,
        lessons: [
          { title: 'Introdução ao nail art', order: 1, duration: 20, isFree: true },
          { title: 'Ferramentas e materiais', order: 2, duration: 40 },
          { title: 'Preparação de unhas', order: 3, duration: 35 },
        ],
      },
      {
        title: 'Módulo 2: Técnicas Básicas',
        order: 2,
        lessons: [
          { title: 'Pintura à mão livre', order: 1, duration: 50 },
          { title: 'Degradê e ombré', order: 2, duration: 45 },
          { title: 'Francesinha criativa', order: 3, duration: 40 },
        ],
      },
      {
        title: 'Módulo 3: Técnicas Intermediárias',
        order: 3,
        lessons: [
          { title: 'Nail art com carimbo', order: 1, duration: 45 },
          { title: 'Adesivos e decalques', order: 2, duration: 35 },
          { title: 'Efeito mármore', order: 3, duration: 40 },
        ],
      },
      {
        title: 'Módulo 4: Técnicas Avançadas',
        order: 4,
        lessons: [
          { title: 'Pedrarias e aplicações', order: 1, duration: 50 },
          { title: 'Técnicas 3D', order: 2, duration: 55 },
          { title: 'Encapsulamento', order: 3, duration: 45 },
        ],
      },
      {
        title: 'Módulo 5: Negócios',
        order: 5,
        lessons: [
          { title: 'Montando seu portfólio', order: 1, duration: 30 },
          { title: 'Precificação de nail art', order: 2, duration: 25 },
          { title: 'Marketing no Instagram', order: 3, duration: 35 },
        ],
      },
    ],
  },

  // 6. Alongamento de Cílios
  {
    title: 'Alongamento de Cílios - Técnicas Fio a Fio',
    slug: 'alongamento-cilios-tecnicas-fio-a-fio',
    description: `Aprenda a técnica de alongamento de cílios fio a fio, desde o básico até técnicas avançadas como volume russo e mega volume.

Conteúdo:
- Anatomia dos cílios
- Tipos de fios e curvaturas
- Preparação e isolamento
- Técnica clássica (1x1)
- Técnica volume russo (2D-5D)
- Mega volume (6D-10D)
- Efeitos: Cat Eye, Doll Eye, Natural, Squirrel
- Manutenção e retirada
- Cuidados e orientações ao cliente
- Biossegurança
- Precificação e atendimento

Diferenciais:
- Prática com modelo real (aula presencial)
- Kit inicial incluso
- Suporte pós-curso

Pré-requisitos:
Nenhum

Certificado:
Profissionalizante`,
    shortDescription: 'Alongamento clássico, volume russo e mega volume',
    type: 'HYBRID',
    level: 'BEGINNER',
    price: 697.00,
    compareAtPrice: 997.00,
    thumbnail: '/images/courses/alongamento-cilios.jpg',
    duration: 480, // 8 horas
    modules: [
      {
        title: 'Módulo 1: Teórico Online',
        order: 1,
        lessons: [
          { title: 'Anatomia dos cílios', order: 1, duration: 30, isFree: true },
          { title: 'Materiais e ferramentas', order: 2, duration: 40 },
          { title: 'Tipos de fios e curvaturas', order: 3, duration: 35 },
          { title: 'Biossegurança', order: 4, duration: 25 },
        ],
      },
      {
        title: 'Módulo 2: Técnica Clássica',
        order: 2,
        lessons: [
          { title: 'Preparação e isolamento', order: 1, duration: 40 },
          { title: 'Técnica fio a fio (1x1)', order: 2, duration: 60 },
          { title: 'Prática: alongamento clássico', order: 3, duration: 90 },
        ],
      },
      {
        title: 'Módulo 3: Volume Russo',
        order: 3,
        lessons: [
          { title: 'Conceitos de volume russo', order: 1, duration: 30 },
          { title: 'Montagem de leques', order: 2, duration: 50 },
          { title: 'Prática: volume 2D-5D', order: 3, duration: 80 },
        ],
      },
    ],
  },

  // 7. Maquiagem Editorial
  {
    title: 'Maquiagem Editorial e Artística',
    slug: 'maquiagem-editorial-artistica',
    description: `Curso avançado de maquiagem editorial para fashion, fotografia, passarela e trabalhos artísticos.

Conteúdo:
- Maquiagem para fotografia
- Maquiagem para passarela
- Maquiagem editorial (revistas, catálogos)
- Maquiagem artística e conceitual
- Trabalho com iluminação de estúdio
- Relação com fotógrafos e diretores de arte
- Portfólio profissional
- Editoriais de moda
- Como trabalhar em semanas de moda
- Networking na indústria fashion

Pré-requisitos:
Conhecimento intermediário/avançado de maquiagem

Certificado:
Especialização Profissional

Diferenciais:
- Ensaio fotográfico incluso
- Portfólio profissional
- Conexão com agências`,
    shortDescription: 'Maquiagem para moda, fotografia e arte',
    type: 'IN_PERSON',
    level: 'ADVANCED',
    price: 1497.00,
    thumbnail: '/images/courses/maquiagem-editorial.jpg',
    duration: 960, // 16 horas
    modules: [
      {
        title: 'Dia 1: Maquiagem para Fotografia',
        order: 1,
        lessons: [
          { title: 'Luz, câmera e maquiagem', order: 1, duration: 120 },
          { title: 'Prática: ensaio beauty', order: 2, duration: 120 },
        ],
      },
      {
        title: 'Dia 2: Maquiagem Editorial',
        order: 2,
        lessons: [
          { title: 'Referências e moodboard', order: 1, duration: 90 },
          { title: 'Prática: editorial de moda', order: 2, duration: 150 },
        ],
      },
      {
        title: 'Dia 3: Maquiagem Artística',
        order: 3,
        lessons: [
          { title: 'Conceitos e criatividade', order: 1, duration: 80 },
          { title: 'Prática: maquiagem artística', order: 2, duration: 160 },
        ],
      },
      {
        title: 'Dia 4: Mercado e Portfólio',
        order: 4,
        lessons: [
          { title: 'Montando seu book profissional', order: 1, duration: 120 },
          { title: 'Networking e mercado fashion', order: 2, duration: 120 },
        ],
      },
    ],
  },

  // 8. Corte e Escova
  {
    title: 'Corte e Escova Profissional',
    slug: 'corte-escova-profissional',
    description: `Curso completo de cabeleireiro: técnicas de corte (feminino e masculino), escova e penteados.

Programa:
- Teoria do corte de cabelo
- Ferramentas e equipamentos
- Corte feminino (reto, repicado, long bob, pixie, franja)
- Corte masculino (social, degradê, fade, undercut)
- Técnicas de escova (lisa, babyliss, ondas)
- Penteados para eventos
- Finalização profissional
- Visagismo aplicado ao corte
- Precificação e atendimento

Metodologia:
Aulas práticas intensivas com modelos reais.

Pré-requisitos:
Nenhum. Aceita iniciantes.

Certificado:
Profissionalizante com estágio supervisionado

Material:
Kit básico incluso (tesouras, pente, escova)`,
    shortDescription: 'Técnicas de corte, escova e penteados profissionais',
    type: 'IN_PERSON',
    level: 'ALL_LEVELS',
    price: 1897.00,
    thumbnail: '/images/courses/corte-escova.jpg',
    duration: 2400, // 40 horas
    modules: [
      {
        title: 'Semana 1: Fundamentos',
        order: 1,
        lessons: [
          { title: 'Introdução ao curso', order: 1, duration: 60, isFree: true },
          { title: 'Ferramentas e equipamentos', order: 2, duration: 120 },
          { title: 'Teoria do corte', order: 3, duration: 180 },
          { title: 'Visagismo', order: 4, duration: 120 },
        ],
      },
      {
        title: 'Semana 2: Corte Feminino',
        order: 2,
        lessons: [
          { title: 'Corte reto e graduado', order: 1, duration: 240 },
          { title: 'Long bob e chanel', order: 2, duration: 240 },
        ],
      },
      {
        title: 'Semana 3: Corte Masculino',
        order: 3,
        lessons: [
          { title: 'Corte social', order: 1, duration: 240 },
          { title: 'Degradê e fade', order: 2, duration: 240 },
        ],
      },
      {
        title: 'Semana 4: Escova e Penteados',
        order: 4,
        lessons: [
          { title: 'Técnicas de escova profissional', order: 1, duration: 240 },
          { title: 'Penteados para eventos', order: 2, duration: 240 },
        ],
      },
      {
        title: 'Semana 5: Prática e Negócios',
        order: 5,
        lessons: [
          { title: 'Atendimentos práticos supervisionados', order: 1, duration: 360 },
          { title: 'Precificação e carreira', order: 2, duration: 120 },
        ],
      },
    ],
  },

  // 9. Marketing para Beauty Professionals
  {
    title: 'Marketing Digital para Profissionais de Beleza',
    slug: 'marketing-digital-profissionais-beleza',
    description: `Aprenda a divulgar seus serviços, atrair clientes e vender mais usando Instagram, TikTok e outras redes sociais.

Conteúdo:
- Posicionamento de marca pessoal
- Instagram para beleza (stories, reels, feed)
- TikTok para beauty professionals
- Criação de conteúdo que vende
- Como ganhar seguidores reais
- Agendamento online
- Relacionamento com cliente
- WhatsApp Business
- Google Meu Negócio
- Fotos profissionais com celular
- Copywriting para beleza
- Anúncios pagos (básico)
- Métricas e resultados

Ideal para:
Profissionais de beleza que querem crescer no digital e atrair mais clientes.

Certificado:
Digital

Bônus:
- Templates prontos para canva
- Scripts de vendas
- Planejamento de conteúdo mensal`,
    shortDescription: 'Instagram, TikTok e vendas online para beauty',
    type: 'ONLINE',
    level: 'BEGINNER',
    price: 297.00,
    compareAtPrice: 497.00,
    thumbnail: '/images/courses/marketing-beauty.jpg',
    duration: 480, // 8 horas
    modules: [
      {
        title: 'Módulo 1: Fundamentos',
        order: 1,
        lessons: [
          { title: 'Bem-vindo ao curso', order: 1, duration: 15, isFree: true },
          { title: 'Posicionamento de marca pessoal', order: 2, duration: 45 },
          { title: 'Seu cliente ideal', order: 3, duration: 40 },
        ],
      },
      {
        title: 'Módulo 2: Instagram',
        order: 2,
        lessons: [
          { title: 'Perfil que vende', order: 1, duration: 45 },
          { title: 'Criação de conteúdo', order: 2, duration: 60 },
          { title: 'Stories e reels', order: 3, duration: 50 },
          { title: 'Como ganhar seguidores', order: 4, duration: 40 },
        ],
      },
      {
        title: 'Módulo 3: Outras Plataformas',
        order: 3,
        lessons: [
          { title: 'TikTok para beleza', order: 1, duration: 45 },
          { title: 'WhatsApp Business', order: 2, duration: 30 },
          { title: 'Google Meu Negócio', order: 3, duration: 25 },
        ],
      },
      {
        title: 'Módulo 4: Vendas Online',
        order: 4,
        lessons: [
          { title: 'Agendamento online', order: 1, duration: 35 },
          { title: 'Copywriting que vende', order: 2, duration: 40 },
          { title: 'Como fechar mais atendimentos', order: 3, duration: 30 },
        ],
      },
    ],
  },

  // 10. Gestão de Salão
  {
    title: 'Gestão de Salão de Beleza - Do Básico ao Avançado',
    slug: 'gestao-salao-beleza-basico-avancado',
    description: `Aprenda a gerenciar um salão de beleza de forma profissional e lucrativa. Desde abertura até crescimento e expansão.

Conteúdo Completo:
- Como abrir um salão (documentação, alvará, licenças)
- Plano de negócios para salão
- Localização e estrutura física
- Fornecedores e estoque
- Precificação de serviços
- Controle financeiro (entrada, saída, lucro)
- Gestão de equipe e contratação
- Treinamento de colaboradores
- Atendimento ao cliente de excelência
- Marketing para salões
- Fidelização de clientes
- Sistemas de gestão (softwares)
- Métricas e indicadores (KPIs)
- Crescimento e expansão

Bônus:
- Planilhas de gestão prontas
- Contratos e documentos
- Checklist de abertura
- Software de gestão (3 meses grátis)

Certificado:
Gestão de Negócios de Beleza

Ideal para:
Proprietários, gerentes e futuros donos de salão`,
    shortDescription: 'Gerencie seu salão de forma profissional e lucrativa',
    type: 'ONLINE',
    level: 'ALL_LEVELS',
    price: 697.00,
    compareAtPrice: 997.00,
    thumbnail: '/images/courses/gestao-salao.jpg',
    duration: 1200, // 20 horas
    modules: [
      {
        title: 'Módulo 1: Planejamento',
        order: 1,
        lessons: [
          { title: 'Introdução à gestão de salões', order: 1, duration: 20, isFree: true },
          { title: 'Plano de negócios', order: 2, duration: 60 },
          { title: 'Documentação e legalização', order: 3, duration: 50 },
          { title: 'Localização e estrutura física', order: 4, duration: 45 },
        ],
      },
      {
        title: 'Módulo 2: Financeiro',
        order: 2,
        lessons: [
          { title: 'Controle financeiro básico', order: 1, duration: 60 },
          { title: 'Precificação de serviços', order: 2, duration: 50 },
          { title: 'Gestão de estoque', order: 3, duration: 45 },
          { title: 'Fluxo de caixa', order: 4, duration: 40 },
        ],
      },
      {
        title: 'Módulo 3: Gestão de Pessoas',
        order: 3,
        lessons: [
          { title: 'Contratação e equipe', order: 1, duration: 50 },
          { title: 'Treinamento de colaboradores', order: 2, duration: 45 },
          { title: 'Motivação e retenção', order: 3, duration: 40 },
        ],
      },
      {
        title: 'Módulo 4: Marketing e Vendas',
        order: 4,
        lessons: [
          { title: 'Marketing para salões', order: 1, duration: 60 },
          { title: 'Atendimento de excelência', order: 2, duration: 50 },
          { title: 'Fidelização de clientes', order: 3, duration: 45 },
          { title: 'Pacotes e promoções', order: 4, duration: 40 },
        ],
      },
      {
        title: 'Módulo 5: Tecnologia e Sistemas',
        order: 5,
        lessons: [
          { title: 'Sistemas de gestão para salões', order: 1, duration: 50 },
          { title: 'Agendamento online', order: 2, duration: 40 },
          { title: 'Métricas e KPIs', order: 3, duration: 45 },
        ],
      },
      {
        title: 'Módulo 6: Crescimento',
        order: 6,
        lessons: [
          { title: 'Estratégias de crescimento', order: 1, duration: 50 },
          { title: 'Expansão e franquias', order: 2, duration: 45 },
          { title: 'Casos de sucesso', order: 3, duration: 40 },
        ],
      },
    ],
  },
];
