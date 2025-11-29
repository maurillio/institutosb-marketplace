import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/seller/payouts - Listar payouts do vendedor
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente vendedores.' },
        { status: 403 }
      );
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Perfil de vendedor não encontrado' },
        { status: 404 }
      );
    }

    const payouts = await prisma.payout.findMany({
      where: {
        sellerId: sellerProfile.id,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    return NextResponse.json(payouts);
  } catch (error) {
    console.error('Erro ao buscar payouts:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar payouts' },
      { status: 500 }
    );
  }
}
