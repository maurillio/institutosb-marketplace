import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET /api/seller/products/[id] - Buscar produto específico do vendedor
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
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

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id,
      },
      include: {
        category: true,
        variations: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Converter Decimal para Number
    const productWithNumber = {
      ...product,
      price: Number(product.price),
    };

    return NextResponse.json(productWithNumber);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}

// PUT /api/seller/products/[id] - Atualizar produto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
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

    // Verificar se o produto pertence ao vendedor
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      categoryId,
      images,
      condition,
      stock,
      status,
    } = body;

    // Atualizar produto
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId && { categoryId }),
        ...(images && { images }),
        ...(condition && { condition }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(status && { status }),
      },
      include: {
        category: true,
        variations: true,
      },
    });

    // Converter Decimal para Number
    const productWithNumber = {
      ...product,
      price: Number(product.price),
    };

    return NextResponse.json(productWithNumber);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

// DELETE /api/seller/products/[id] - Deletar produto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
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

    // Verificar se o produto pertence ao vendedor
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Soft delete (mudar status para INACTIVE)
    await prisma.product.update({
      where: { id: params.id },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    );
  }
}
