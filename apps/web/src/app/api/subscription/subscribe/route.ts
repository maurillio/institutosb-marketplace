import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';
import { SUBSCRIPTION_PLANS } from '../plans/route';

// POST /api/subscription/subscribe - Assinar/Fazer upgrade de plano
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, profileType } = body; // profileType: 'seller' | 'instructor'

    // Validar plano
    if (!SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];

    // Validar profile type
    if (!profileType || !['seller', 'instructor'].includes(profileType)) {
      return NextResponse.json(
        { error: 'Tipo de perfil inválido' },
        { status: 400 }
      );
    }

    // Buscar usuário e verificar role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        sellerProfile: profileType === 'seller',
        instructorProfile: profileType === 'instructor',
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem a role necessária
    const requiredRole = profileType === 'seller' ? 'SELLER' : 'INSTRUCTOR';
    if (!user.roles.includes(requiredRole)) {
      return NextResponse.json(
        { error: `Usuário não possui perfil de ${profileType}` },
        { status: 403 }
      );
    }

    // Verificar se o perfil existe
    const profile = profileType === 'seller' ? user.sellerProfile : user.instructorProfile;
    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      );
    }

    // Para plano FREE, apenas atualizar
    if (planId === 'FREE') {
      if (profileType === 'seller') {
        await prisma.sellerProfile.update({
          where: { userId: user.id },
          data: {
            plan: 'FREE',
            planExpiresAt: null,
          },
        });
      } else {
        await prisma.instructorProfile.update({
          where: { userId: user.id },
          data: {
            plan: 'FREE',
            planExpiresAt: null,
          },
        });
      }

      return NextResponse.json({
        success: true,
        plan: 'FREE',
        message: 'Plano alterado para gratuito',
      });
    }

    // Para planos pagos, criar preferência de pagamento do Mercado Pago
    // Por enquanto, vamos simular a assinatura (TODO: Integrar Mercado Pago)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mês

    if (profileType === 'seller') {
      await prisma.sellerProfile.update({
        where: { userId: user.id },
        data: {
          plan: planId,
          planExpiresAt: expiresAt,
        },
      });
    } else {
      await prisma.instructorProfile.update({
        where: { userId: user.id },
        data: {
          plan: planId,
          planExpiresAt: expiresAt,
        },
      });
    }

    // TODO: Integrar com Mercado Pago para criar assinatura recorrente
    // const mercadoPagoPreference = await createSubscriptionPreference({
    //   userId: user.id,
    //   planId,
    //   price: plan.price,
    //   billingCycle: plan.billingCycle,
    // });

    return NextResponse.json({
      success: true,
      plan: planId,
      expiresAt,
      // mercadoPagoUrl: mercadoPagoPreference.init_point, // URL para redirecionar
      message: 'Assinatura criada com sucesso (simulado)',
    });
  } catch (error) {
    console.error('Erro ao assinar plano:', error);
    return NextResponse.json(
      { error: 'Erro ao assinar plano' },
      { status: 500 }
    );
  }
}
