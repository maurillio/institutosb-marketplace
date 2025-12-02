import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// GET /api/products/[id]/reviews - Listar reviews do produto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, helpful, rating_high, rating_low
    const filterRating = searchParams.get('rating'); // 1-5

    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {
      productId: params.id,
      isPublished: true,
    };

    if (filterRating) {
      where.rating = parseInt(filterRating);
    }

    // Ordenação
    let orderBy: any = { createdAt: 'desc' }; // recent
    if (sortBy === 'rating_high') orderBy = { rating: 'desc' };
    if (sortBy === 'rating_low') orderBy = { rating: 'asc' };
    // helpful requer campo adicional que vou adicionar depois

    // Buscar reviews
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Calcular estatísticas
    const stats = await prisma.review.aggregate({
      where: { productId: params.id, isPublished: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // Distribuição de ratings
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId: params.id, isPublished: true },
      _count: { rating: true },
    });

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingDistribution.forEach((item) => {
      distribution[item.rating as keyof typeof distribution] = item._count.rating;
    });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        avgRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating || 0,
        distribution,
      },
    });
  } catch (error) {
    console.error('[Reviews API] Erro ao buscar reviews:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar reviews' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews - Criar review de produto
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, title, comment } = body;

    // Validações
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating deve ser entre 1 e 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comentário deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se usuário já avaliou este produto
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: params.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Você já avaliou este produto' },
        { status: 400 }
      );
    }

    // Verificar se usuário comprou o produto (opcional mas recomendado)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: params.id,
        order: {
          buyerId: session.user.id,
          status: 'DELIVERED', // Só pode avaliar após entrega
        },
      },
    });

    const isVerifiedPurchase = !!hasPurchased;

    // Criar review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: params.id,
        type: 'PRODUCT',
        rating,
        title: title?.trim() || null,
        comment: comment.trim(),
        isVerifiedPurchase,
        isPublished: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Atualizar média de rating do produto (denormalização para performance)
    const avgRating = await prisma.review.aggregate({
      where: { productId: params.id, isPublished: true },
      _avg: { rating: true },
    });

    await prisma.product.update({
      where: { id: params.id },
      data: {
        avgRating: avgRating._avg.rating || 0,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('[Reviews API] Erro ao criar review:', error);
    return NextResponse.json(
      { error: 'Erro ao criar review' },
      { status: 500 }
    );
  }
}
