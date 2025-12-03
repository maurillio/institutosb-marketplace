import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';
import { NotificationService } from '@/lib/notifications';

// GET /api/seller/orders/[id] - Detalhes do pedido
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente vendedores.' },
        { status: 403 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
        payment: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                sellerId: true,
              },
            },
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

    // Verificar se o vendedor tem permissão (pelo menos um item do pedido é dele)
    const hasPermission = order.items.some(
      (item) => item.product.sellerId === session.user.id
    );

    if (!hasPermission && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Você não tem permissão para acessar este pedido' },
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
      payment: order.payment ? {
        ...order.payment,
        amount: Number(order.payment.amount),
      } : null,
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

// PATCH /api/seller/orders/[id] - Atualizar status e tracking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente vendedores.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, trackingCode, shippingCarrier } = body;

    // Buscar pedido atual
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                sellerId: true,
                name: true,
              },
            },
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

    // Verificar permissão
    const hasPermission = order.items.some(
      (item) => item.product.sellerId === session.user.id
    );

    if (!hasPermission && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Você não tem permissão para atualizar este pedido' },
        { status: 403 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {};

    if (status) {
      updateData.status = status;

      // Atualizar timestamps baseado no status
      if (status === 'SHIPPED' && !order.shippedAt) {
        updateData.shippedAt = new Date();
      }
      if (status === 'DELIVERED' && !order.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
    }

    if (trackingCode !== undefined) {
      updateData.trackingCode = trackingCode;
    }

    if (shippingCarrier !== undefined) {
      updateData.shippingCarrier = shippingCarrier;
    }

    // Atualizar pedido
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    // Enviar notificação ao comprador
    if (status && status !== order.status) {
      // Notificação de mudança de status
      let notificationTitle = '';
      let notificationMessage = '';

      switch (status) {
        case 'PROCESSING':
          notificationTitle = 'Pedido em processamento';
          notificationMessage = `Seu pedido #${order.orderNumber} está sendo preparado para envio.`;
          break;
        case 'SHIPPED':
          notificationTitle = 'Pedido enviado';
          notificationMessage = trackingCode
            ? `Seu pedido #${order.orderNumber} foi enviado! Código de rastreio: ${trackingCode}`
            : `Seu pedido #${order.orderNumber} foi enviado!`;
          break;
        case 'DELIVERED':
          notificationTitle = 'Pedido entregue';
          notificationMessage = `Seu pedido #${order.orderNumber} foi entregue. Aproveite!`;
          break;
        case 'CANCELLED':
          notificationTitle = 'Pedido cancelado';
          notificationMessage = `Seu pedido #${order.orderNumber} foi cancelado.`;
          break;
        default:
          notificationTitle = 'Atualização de pedido';
          notificationMessage = `Seu pedido #${order.orderNumber} foi atualizado.`;
      }

      await NotificationService.create({
        userId: order.buyer.id,
        type: 'ORDER_SHIPPED', // Pode criar novos tipos se necessário
        title: notificationTitle,
        message: notificationMessage,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status,
          trackingCode: trackingCode || order.trackingCode,
        },
      });
    } else if (trackingCode && trackingCode !== order.trackingCode) {
      // Notificação apenas de código de rastreio adicionado
      await NotificationService.create({
        userId: order.buyer.id,
        type: 'ORDER_SHIPPED',
        title: 'Código de rastreio adicionado',
        message: `O código de rastreio do seu pedido #${order.orderNumber} é: ${trackingCode}`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          trackingCode,
        },
      });
    }

    return NextResponse.json({
      ...updatedOrder,
      subtotal: Number(updatedOrder.subtotal),
      shippingCost: Number(updatedOrder.shippingCost),
      discount: Number(updatedOrder.discount),
      total: Number(updatedOrder.total),
      platformFee: Number(updatedOrder.platformFee),
      sellerAmount: Number(updatedOrder.sellerAmount),
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}
