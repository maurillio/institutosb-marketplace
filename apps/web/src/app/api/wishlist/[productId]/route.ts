import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/wishlist/[productId] - Verificar se produto está na wishlist
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.productId,
        },
      },
    });

    return NextResponse.json({
      inWishlist: !!wishlistItem,
      item: wishlistItem,
    });
  } catch (error) {
    console.error('Erro ao verificar wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar lista de desejos' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist/[productId] - Remover produto da wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.productId,
        },
      },
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Produto não está na lista de desejos' },
        { status: 404 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.productId,
        },
      },
    });

    return NextResponse.json({
      message: 'Produto removido da lista de desejos',
    });
  } catch (error) {
    console.error('Erro ao remover da wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao remover da lista de desejos' },
      { status: 500 }
    );
  }
}
