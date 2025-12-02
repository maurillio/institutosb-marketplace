import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// GET /api/courses/[id]/reviews - Listar reviews do curso
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'recent';
    const filterRating = searchParams.get('rating');

    const skip = (page - 1) * limit;

    const where: any = {
      courseId: params.id,
      isPublished: true,
    };

    if (filterRating) {
      where.rating = parseInt(filterRating);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'rating_high') orderBy = { rating: 'desc' };
    if (sortBy === 'rating_low') orderBy = { rating: 'asc' };

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

    const stats = await prisma.review.aggregate({
      where: { courseId: params.id, isPublished: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { courseId: params.id, isPublished: true },
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
    console.error('[Course Reviews API] Erro ao buscar reviews:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar reviews' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[id]/reviews - Criar review de curso
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Verificar se o curso existe
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se usuário já avaliou este curso
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        courseId: params.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Você já avaliou este curso' },
        { status: 400 }
      );
    }

    // Verificar se usuário está matriculado no curso
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: params.id,
        status: 'ACTIVE', // Apenas alunos ativos podem avaliar
      },
    });

    const isVerifiedPurchase = !!enrollment;

    // Criar review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        courseId: params.id,
        type: 'COURSE',
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

    // Atualizar média de rating do curso
    const avgRating = await prisma.review.aggregate({
      where: { courseId: params.id, isPublished: true },
      _avg: { rating: true },
    });

    await prisma.course.update({
      where: { id: params.id },
      data: {
        avgRating: avgRating._avg.rating || 0,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('[Course Reviews API] Erro ao criar review:', error);
    return NextResponse.json(
      { error: 'Erro ao criar review' },
      { status: 500 }
    );
  }
}
