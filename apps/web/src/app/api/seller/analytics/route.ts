import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';

// GET /api/seller/analytics - Analytics e métricas do vendedor
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
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

    // 1. Total de produtos
    const totalProducts = await prisma.product.count({
      where: {
        sellerId: sellerProfile.id,
        status: 'ACTIVE',
      },
    });

    // 2. Total de vendas (pedidos confirmados ou entregues)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        sellerId: sellerProfile.id,
        order: {
          status: {
            in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
      include: {
        order: {
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
    });

    const totalSales = orderItems.length;
    const totalRevenue = orderItems.reduce((sum, item) => sum + item.total, 0);

    // 3. Vendas por status
    const salesByStatus = {
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
    };

    orderItems.forEach((item) => {
      const status = item.order.status as keyof typeof salesByStatus;
      if (status in salesByStatus) {
        salesByStatus[status]++;
      }
    });

    // 4. Payouts disponíveis e processados
    const [availablePayouts, processedPayouts] = await Promise.all([
      prisma.payout.aggregate({
        where: {
          sellerId: sellerProfile.id,
          status: 'PENDING',
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.payout.aggregate({
        where: {
          sellerId: sellerProfile.id,
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // 5. Produtos mais vendidos
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        sellerId: sellerProfile.id,
        order: {
          status: {
            in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Buscar nomes dos produtos
    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            images: true,
          },
        });
        return {
          productId: item.productId,
          name: product?.name || 'Produto removido',
          images: product?.images || [],
          totalSold: item._sum.quantity || 0,
          totalRevenue: item._sum.total || 0,
          orderCount: item._count.id,
        };
      })
    );

    // 6. Vendas nos últimos 30 dias (agrupado por dia)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = await prisma.orderItem.findMany({
      where: {
        sellerId: sellerProfile.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
        order: {
          status: {
            in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Agrupar por dia
    const salesByDay = recentSales.reduce((acc: any, sale) => {
      const date = sale.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, count: 0 };
      }
      acc[date].revenue += sale.total;
      acc[date].count++;
      return acc;
    }, {});

    const salesChart = Object.values(salesByDay).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );

    return NextResponse.json({
      overview: {
        totalProducts,
        totalSales,
        totalRevenue,
        availablePayout: availablePayouts._sum.amount || 0,
        processedPayout: processedPayouts._sum.amount || 0,
        rating: sellerProfile.rating,
      },
      salesByStatus,
      topProducts: topProductsWithNames,
      salesChart,
    });
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar analytics' },
      { status: 500 }
    );
  }
}
