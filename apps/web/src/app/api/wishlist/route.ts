import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/wishlist - Listar todos os produtos na wishlist do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Converter Decimal para Number nos produtos
    const wishlistData = wishlistItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        compareAtPrice: item.product.compareAtPrice
          ? Number(item.product.compareAtPrice)
          : null,
        rating: item.product.rating ? Number(item.product.rating) : null,
      },
    }));

    return NextResponse.json(wishlistData);
  } catch (error) {
    console.error('Erro ao buscar wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar lista de desejos' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Adicionar produto à wishlist
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se já está na wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Produto já está na lista de desejos' },
        { status: 400 }
      );
    }

    // Adicionar à wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Produto adicionado à lista de desejos',
        item: wishlistItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao adicionar à wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar à lista de desejos' },
      { status: 500 }
    );
  }
}
