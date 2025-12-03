import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/subscription/current - Obter assinatura atual do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        roles: true,
        sellerProfile: {
          select: {
            plan: true,
            planExpiresAt: true,
          },
        },
        instructorProfile: {
          select: {
            plan: true,
            planExpiresAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Determinar o plano atual baseado nas roles
    let currentPlan = null;
    let planExpiresAt = null;
    let profileType = null;

    if (user.roles.includes('SELLER') && user.sellerProfile) {
      currentPlan = user.sellerProfile.plan;
      planExpiresAt = user.sellerProfile.planExpiresAt;
      profileType = 'seller';
    } else if (user.roles.includes('INSTRUCTOR') && user.instructorProfile) {
      currentPlan = user.instructorProfile.plan;
      planExpiresAt = user.instructorProfile.planExpiresAt;
      profileType = 'instructor';
    }

    // Verificar se o plano expirou
    const isExpired = planExpiresAt && new Date(planExpiresAt) < new Date();

    return NextResponse.json({
      currentPlan: isExpired ? 'FREE' : currentPlan,
      planExpiresAt,
      isExpired,
      profileType,
      roles: user.roles,
    });
  } catch (error) {
    console.error('Erro ao obter assinatura atual:', error);
    return NextResponse.json(
      { error: 'Erro ao obter assinatura atual' },
      { status: 500 }
    );
  }
}
