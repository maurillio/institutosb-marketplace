import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/orders - Listar pedidos do usuário
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        buyerId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Criar novo pedido
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingCost,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio' },
        { status: 400 }
      );
    }

    // Calcular total dos produtos
    let subtotal = 0;
    const orderItems = [];
    let firstSellerId: string | null = null;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          seller: true,
          variations: true,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Produto ${item.productId} não encontrado` },
          { status: 404 }
        );
      }

      // Verificar estoque
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Produto ${product.name} sem estoque suficiente` },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      // Armazenar o primeiro sellerId
      if (!firstSellerId) {
        firstSellerId = product.sellerId;
      }

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price,
      });
    }

    if (!firstSellerId) {
      return NextResponse.json(
        { error: 'Nenhum vendedor encontrado' },
        { status: 400 }
      );
    }

    const shippingCostDecimal = shippingCost || 0;
    const total = subtotal + shippingCostDecimal;

    // Calcular taxa da plataforma (10%)
    const platformFee = total * 0.1;
    const sellerAmount = total - platformFee;

    // Buscar ou criar endereço padrão do usuário
    let userAddress = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    });

    // Se não tiver endereço padrão, criar um temporário
    if (!userAddress) {
      userAddress = await prisma.address.create({
        data: {
          userId: session.user.id,
          label: 'Endereço Padrão',
          street: shippingAddress?.street || 'A definir',
          number: shippingAddress?.number || 'S/N',
          complement: shippingAddress?.complement || null,
          neighborhood: shippingAddress?.neighborhood || 'A definir',
          city: shippingAddress?.city || 'A definir',
          state: shippingAddress?.state || 'A definir',
          zipCode: shippingAddress?.zipCode || '00000-000',
          country: 'Brasil',
          isDefault: true,
        },
      });
    }

    // Gerar número do pedido único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId: session.user.id,
        sellerId: firstSellerId,
        addressId: userAddress.id,
        status: 'PENDING',
        subtotal,
        shippingCost: shippingCostDecimal,
        total,
        platformFee,
        sellerAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Atualizar estoque dos produtos
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    );
  }
}
