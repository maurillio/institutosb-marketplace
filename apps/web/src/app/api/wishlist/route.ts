import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/wishlist - Listar produtos da wishlist do usuário
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
                sellerProfile: {
                  select: {
                    rating: true,
                  },
                },
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error('Erro ao buscar wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar wishlist' },
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
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Produto já está na wishlist' },
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
        product: true,
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar à wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar à wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remover produto da wishlist
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId é obrigatório' },
        { status: 400 }
      );
    }

    // Remover da wishlist
    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return NextResponse.json({ message: 'Removido da wishlist' });
  } catch (error: any) {
    console.error('Erro ao remover da wishlist:', error);

    // Se o item não existir, retornar sucesso mesmo assim
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Removido da wishlist' });
    }

    return NextResponse.json(
      { error: 'Erro ao remover da wishlist' },
      { status: 500 }
    );
  }
}
