import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar role ADMIN
    const roles = session.user.roles || [];
    if (!roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente administradores.' },
        { status: 403 }
      );
    }

    // Query params
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'day';

    // Datas padrão: últimos 30 dias
    const startDate = startDateParam
      ? new Date(startDateParam)
      : startOfDay(subDays(new Date(), 30));
    const endDate = endDateParam
      ? new Date(endDateParam)
      : endOfDay(new Date());

    // Total de usuários
    const totalUsers = await prisma.user.count();

    // Novos usuários no período
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Usuários ativos (com lastLoginAt no período)
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Usuários por role
    const allUsers = await prisma.user.findMany({
      select: {
        roles: true,
      },
    });

    const byRole = {
      CUSTOMER: 0,
      SELLER: 0,
      INSTRUCTOR: 0,
      ADMIN: 0,
    };

    allUsers.forEach((user) => {
      user.roles.forEach((role) => {
        if (role in byRole) {
          byRole[role as keyof typeof byRole]++;
        }
      });
    });

    // Crescimento de usuários (timeline)
    const usersInPeriod = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Agrupar por data
    const growthMap = new Map<string, { date: string; count: number }>();

    usersInPeriod.forEach((user) => {
      const dateKey = format(new Date(user.createdAt),
        groupBy === 'month' ? 'yyyy-MM' :
        groupBy === 'week' ? 'yyyy-\'W\'II' :
        'yyyy-MM-dd'
      );

      const existing = growthMap.get(dateKey) || { date: dateKey, count: 0 };
      existing.count += 1;
      growthMap.set(dateKey, existing);
    });

    const growth = Array.from(growthMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Usuários por status
    const byStatus = await prisma.user.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });

    const statusCounts = byStatus.reduce((acc, item) => {
      acc[item.status] = item._count._all;
      return acc;
    }, {} as Record<string, number>);

    // Resposta
    return NextResponse.json({
      summary: {
        totalUsers,
        newUsers,
        activeUsers,
        byRole,
        byStatus: statusCounts,
      },
      growth,
    });
  } catch (error) {
    console.error('[Admin Reports API] Erro ao buscar relatório de usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar relatório de usuários' },
      { status: 500 }
    );
  }
}
