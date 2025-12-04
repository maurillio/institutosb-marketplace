import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// Forçar rota dinâmica (necessário para getServerSession)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário tem role ADMIN
    const roles = session.user.roles || [];
    if (!roles.includes('ADMIN')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar estatísticas do sistema
    const [totalUsers, totalProducts, totalCourses, orders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.course.count(),
      prisma.order.findMany({
        where: {
          status: 'COMPLETED',
        },
        select: {
          total: true,
        },
      }),
    ]);

    // Calcular receita total
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + Number(order.total);
    }, 0);

    const totalSales = orders.length;

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalCourses,
      totalSales,
      totalRevenue,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
