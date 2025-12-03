import { NextResponse } from 'next/server';

// Definição dos planos disponíveis
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Gratuito',
    price: 0,
    billingCycle: 'lifetime',
    features: {
      seller: {
        maxProducts: 5,
        commissionRate: 15, // 15% de comissão da plataforma
        featuredProducts: 0,
        analytics: false,
        prioritySupport: false,
        customDomain: false,
      },
      instructor: {
        maxCourses: 2,
        commissionRate: 20, // 20% de comissão da plataforma
        liveClasses: false,
        certificates: false,
        analytics: false,
        prioritySupport: false,
      },
    },
    description: 'Perfeito para começar',
    highlights: [
      'Até 5 produtos (vendedores)',
      'Até 2 cursos (instrutores)',
      'Suporte padrão',
      'Ferramentas básicas',
    ],
  },
  BASIC: {
    id: 'BASIC',
    name: 'Básico',
    price: 49.90,
    billingCycle: 'monthly',
    features: {
      seller: {
        maxProducts: 20,
        commissionRate: 12, // 12% de comissão da plataforma
        featuredProducts: 2,
        analytics: true,
        prioritySupport: false,
        customDomain: false,
      },
      instructor: {
        maxCourses: 10,
        commissionRate: 15, // 15% de comissão da plataforma
        liveClasses: false,
        certificates: true,
        analytics: true,
        prioritySupport: false,
      },
    },
    description: 'Ideal para profissionais iniciantes',
    highlights: [
      'Até 20 produtos (vendedores)',
      'Até 10 cursos (instrutores)',
      'Analytics básico',
      '2 produtos em destaque',
      'Certificados de conclusão',
    ],
  },
  PRO: {
    id: 'PRO',
    name: 'Profissional',
    price: 99.90,
    billingCycle: 'monthly',
    features: {
      seller: {
        maxProducts: 100,
        commissionRate: 10, // 10% de comissão da plataforma
        featuredProducts: 5,
        analytics: true,
        prioritySupport: true,
        customDomain: false,
      },
      instructor: {
        maxCourses: 50,
        commissionRate: 12, // 12% de comissão da plataforma
        liveClasses: true,
        certificates: true,
        analytics: true,
        prioritySupport: true,
      },
    },
    description: 'Para quem quer crescer',
    highlights: [
      'Até 100 produtos (vendedores)',
      'Até 50 cursos (instrutores)',
      'Analytics avançado',
      '5 produtos em destaque',
      'Aulas ao vivo',
      'Suporte prioritário',
    ],
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium',
    price: 199.90,
    billingCycle: 'monthly',
    features: {
      seller: {
        maxProducts: -1, // Ilimitado
        commissionRate: 8, // 8% de comissão da plataforma
        featuredProducts: 15,
        analytics: true,
        prioritySupport: true,
        customDomain: true,
      },
      instructor: {
        maxCourses: -1, // Ilimitado
        commissionRate: 10, // 10% de comissão da plataforma
        liveClasses: true,
        certificates: true,
        analytics: true,
        prioritySupport: true,
      },
    },
    description: 'Recursos ilimitados para seu negócio',
    highlights: [
      'Produtos ilimitados (vendedores)',
      'Cursos ilimitados (instrutores)',
      'Analytics completo',
      '15 produtos em destaque',
      'Domínio personalizado',
      'Menor taxa de comissão',
      'Suporte VIP 24/7',
    ],
  },
};

// GET /api/subscription/plans - Listar todos os planos
export async function GET() {
  try {
    const plans = Object.values(SUBSCRIPTION_PLANS);
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Erro ao listar planos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar planos' },
      { status: 500 }
    );
  }
}
