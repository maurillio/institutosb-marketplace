import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';

// GET /api/seller/orders - Listar pedidos recebidos pelo vendedor
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

    // Buscar itens de pedidos onde o vendedor está envolvido
    const orderItems = await prisma.orderItem.findMany({
      where: {
        sellerId: sellerProfile.id,
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            payment: true,
          },
        },
        product: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Agrupar por pedido
    const ordersMap = new Map();

    orderItems.forEach((item) => {
      const orderId = item.orderId;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: item.order.id,
          status: item.order.status,
          total: 0,
          createdAt: item.order.createdAt,
          customer: item.order.user,
          payment: item.order.payment,
          items: [],
        });
      }

      const order = ordersMap.get(orderId);
      order.items.push({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });
      order.total += item.total;
    });

    const orders = Array.from(ordersMap.values());

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}
