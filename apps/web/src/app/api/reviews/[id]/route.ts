import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// PUT /api/reviews/[id] - Editar review
export async function PUT(
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

    // Buscar review
    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se é o autor
    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar esta review' },
        { status: 403 }
      );
    }

    // Validações
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating deve ser entre 1 e 5' },
        { status: 400 }
      );
    }

    if (comment && comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comentário deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Atualizar review
    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...(rating && { rating }),
        ...(title !== undefined && { title: title?.trim() || null }),
        ...(comment && { comment: comment.trim() }),
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

    // Se rating foi alterado, atualizar média
    if (rating && rating !== review.rating) {
      const targetId = review.productId || review.courseId;
      const targetType = review.productId ? 'product' : 'course';

      const avgRating = await prisma.review.aggregate({
        where: {
          ...(targetType === 'product'
            ? { productId: targetId }
            : { courseId: targetId }),
          isPublished: true,
        },
        _avg: { rating: true },
      });

      if (targetType === 'product') {
        await prisma.product.update({
          where: { id: targetId! },
          data: { avgRating: avgRating._avg.rating || 0 },
        });
      } else {
        await prisma.course.update({
          where: { id: targetId! },
          data: { avgRating: avgRating._avg.rating || 0 },
        });
      }
    }

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('[Reviews API] Erro ao editar review:', error);
    return NextResponse.json(
      { error: 'Erro ao editar review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Deletar review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Buscar review
    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review não encontrada' },
        { status: 404 }
      );
    }

    // Verificar permissão (autor ou admin)
    const roles = session.user.roles || [];
    const isAdmin = roles.includes('ADMIN');
    const isAuthor = review.userId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar esta review' },
        { status: 403 }
      );
    }

    const targetId = review.productId || review.courseId;
    const targetType = review.productId ? 'product' : 'course';

    // Deletar review
    await prisma.review.delete({
      where: { id: params.id },
    });

    // Atualizar média
    const avgRating = await prisma.review.aggregate({
      where: {
        ...(targetType === 'product'
          ? { productId: targetId }
          : { courseId: targetId }),
        isPublished: true,
      },
      _avg: { rating: true },
    });

    if (targetType === 'product') {
      await prisma.product.update({
        where: { id: targetId! },
        data: { avgRating: avgRating._avg.rating || 0 },
      });
    } else {
      await prisma.course.update({
        where: { id: targetId! },
        data: { avgRating: avgRating._avg.rating || 0 },
      });
    }

    return NextResponse.json({ message: 'Review deletada com sucesso' });
  } catch (error) {
    console.error('[Reviews API] Erro ao deletar review:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar review' },
      { status: 500 }
    );
  }
}
