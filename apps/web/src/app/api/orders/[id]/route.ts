import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/orders/[id] - Buscar detalhes de um pedido específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                seller: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
        address: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o pedido pertence ao usuário (ou se é admin/vendedor)
    if (order.buyerId !== session.user.id) {
      // TODO: Adicionar verificação para admin ou vendedor do item
      return NextResponse.json(
        { error: 'Sem permissão para acessar este pedido' },
        { status: 403 }
      );
    }

    // Converter Decimal para Number
    const orderData = {
      ...order,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      total: Number(order.total),
      platformFee: Number(order.platformFee),
      sellerAmount: Number(order.sellerAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      payment: order.payment
        ? {
            ...order.payment,
            amount: Number(order.payment.amount),
          }
        : null,
    };

    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    );
  }
}
