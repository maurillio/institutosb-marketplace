import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/seller/analytics - Analytics e métricas do vendedor
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

    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Criar perfil automaticamente se não existir e usuário tiver role SELLER
    if (!sellerProfile && session.user.roles.includes('SELLER')) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true },
      });

      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id,
          storeName: user?.name || 'Minha Loja',
          storeSlug: `loja-${session.user.id.slice(-8)}`,
        },
      });
    }

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Perfil de vendedor não encontrado' },
        { status: 404 }
      );
    }

    // 1. Total de produtos
    const totalProducts = await prisma.product.count({
      where: {
        sellerId: session.user.id,
        status: 'ACTIVE',
      },
    });

    // 2. Total de vendas (pedidos pagos, processando ou entregues)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId: session.user.id,
        },
        order: {
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
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
    const totalRevenue = orderItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    // 3. Vendas por status
    const salesByStatus = {
      PAID: 0,
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
          sellerId: session.user.id,
          status: 'PENDING',
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.payout.aggregate({
        where: {
          sellerId: session.user.id,
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
        product: {
          sellerId: session.user.id,
        },
        order: {
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
      _sum: {
        quantity: true,
        price: true,
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
            price: true,
          },
        });
        const avgPrice = product ? Number(product.price) : Number(item._sum.price || 0) / (item._count.id || 1);
        const totalRevenue = (item._sum.quantity || 0) * avgPrice;

        return {
          productId: item.productId,
          name: product?.name || 'Produto removido',
          images: product?.images || [],
          totalSold: item._sum.quantity || 0,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          orderCount: item._count.id,
        };
      })
    );

    // 6. Vendas nos últimos 30 dias (agrupado por dia)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId: session.user.id,
        },
        order: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
      select: {
        price: true,
        quantity: true,
        order: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    // Agrupar por dia
    const salesByDay = recentSales.reduce((acc: any, sale) => {
      const date = sale.order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, count: 0 };
      }
      acc[date].revenue += Number(sale.price) * sale.quantity;
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
        totalRevenue: Number(totalRevenue),
        availablePayout: Number(availablePayouts._sum.amount) || 0,
        processedPayout: Number(processedPayouts._sum.amount) || 0,
        rating: sellerProfile.rating ? Number(sellerProfile.rating) : null,
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
