import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// Forçar rota dinâmica (necessário para getServerSession)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar role ADMIN
    const roles = session.user.roles || [];
    if (!roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente administradores.' },
        { status: 403 }
      );
    }

    // Query params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const status = searchParams.get('status');
    const condition = searchParams.get('condition');
    const categoryId = searchParams.get('categoryId');
    const sellerId = searchParams.get('sellerId');
    const search = searchParams.get('search');

    // Construir filtros dinâmicos
    const where: any = {};

    // IMPORTANTE: Não filtrar por status ACTIVE - mostrar TODOS os produtos
    if (status) {
      where.status = status;
    }

    if (condition) {
      where.condition = condition;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    // Busca por nome ou descrição
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar produtos com relacionamentos
    const [productsRaw, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
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
                  storeName: true,
                  rating: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
              orderItems: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Converter Decimal para Number e formatar datas
    const products = productsRaw.map((product) => ({
      ...product,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      seller: {
        ...product.seller,
        sellerProfile: product.seller.sellerProfile
          ? {
              ...product.seller.sellerProfile,
              rating: product.seller.sellerProfile.rating
                ? Number(product.seller.sellerProfile.rating)
                : null,
            }
          : null,
      },
    }));

    // Resposta com paginação
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Admin Products API] Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
