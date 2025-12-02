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
    const sellerId = searchParams.get('sellerId');

    // Datas padrão: últimos 30 dias
    const startDate = startDateParam
      ? new Date(startDateParam)
      : startOfDay(subDays(new Date(), 30));
    const endDate = endDateParam
      ? new Date(endDateParam)
      : endOfDay(new Date());

    // Construir filtro de pedidos
    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'],
      },
    };

    // Buscar todos os pedidos no período
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sellerId: true,
              },
            },
          },
        },
      },
    });

    // Calcular estatísticas gerais
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Taxa da plataforma (assumindo 10%)
    const platformFeePercentage = 0.10;
    const platformFees = totalRevenue * platformFeePercentage;

    // Agrupar por data para timeline
    const timelineMap = new Map<string, { date: string; revenue: number; orders: number }>();

    orders.forEach((order) => {
      const dateKey = format(new Date(order.createdAt),
        groupBy === 'month' ? 'yyyy-MM' :
        groupBy === 'week' ? 'yyyy-\'W\'II' :
        'yyyy-MM-dd'
      );

      const existing = timelineMap.get(dateKey) || { date: dateKey, revenue: 0, orders: 0 };
      existing.revenue += Number(order.total);
      existing.orders += 1;
      timelineMap.set(dateKey, existing);
    });

    const timeline = Array.from(timelineMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Top Produtos
    const productSales = new Map<string, {
      id: string;
      name: string;
      quantity: number;
      revenue: number
    }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productSales.get(item.product.id) || {
          id: item.product.id,
          name: item.product.name,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += Number(item.price) * item.quantity;
        productSales.set(item.product.id, existing);
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Top Vendedores
    const sellerSales = new Map<string, {
      sellerId: string;
      orders: number;
      revenue: number
    }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const sellerId = item.product.sellerId;
        const existing = sellerSales.get(sellerId) || {
          sellerId,
          orders: 0,
          revenue: 0,
        };
        existing.orders += 1;
        existing.revenue += Number(item.price) * item.quantity;
        sellerSales.set(sellerId, existing);
      });
    });

    // Buscar dados dos vendedores
    const sellerIds = Array.from(sellerSales.keys());
    const sellers = await prisma.user.findMany({
      where: {
        id: { in: sellerIds },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        sellerProfile: {
          select: {
            storeName: true,
          },
        },
      },
    });

    const topSellers = Array.from(sellerSales.values())
      .map((sale) => {
        const seller = sellers.find((s) => s.id === sale.sellerId);
        return {
          ...sale,
          name: seller?.name || 'Desconhecido',
          avatar: seller?.avatar,
          storeName: seller?.sellerProfile?.storeName,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Resposta
    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        platformFees,
      },
      timeline,
      topProducts,
      topSellers,
    });
  } catch (error) {
    console.error('[Admin Reports API] Erro ao buscar relatório de vendas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar relatório de vendas' },
      { status: 500 }
    );
  }
}
