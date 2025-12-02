import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// POST /api/reviews/[id]/response - Vendedor/instrutor responder à review
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
    const { response } = body;

    // Validações
    if (!response || response.trim().length < 10) {
      return NextResponse.json(
        { error: 'Resposta deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Buscar review
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        product: {
          select: {
            sellerId: true,
          },
        },
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se já tem resposta
    if (review.response) {
      return NextResponse.json(
        { error: 'Esta review já possui uma resposta' },
        { status: 400 }
      );
    }

    // Verificar permissão (deve ser o vendedor do produto ou instrutor do curso)
    const isProductOwner = review.product?.sellerId === session.user.id;
    const isCourseOwner = review.course?.instructorId === session.user.id;
    const roles = session.user.roles || [];
    const isAdmin = roles.includes('ADMIN');

    if (!isProductOwner && !isCourseOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para responder esta review' },
        { status: 403 }
      );
    }

    // Adicionar resposta
    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        response: response.trim(),
        respondedAt: new Date(),
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

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('[Reviews API] Erro ao responder review:', error);
    return NextResponse.json(
      { error: 'Erro ao responder review' },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id]/response - Editar resposta
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
    const { response } = body;

    if (!response || response.trim().length < 10) {
      return NextResponse.json(
        { error: 'Resposta deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        product: {
          select: {
            sellerId: true,
          },
        },
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review não encontrada' },
        { status: 404 }
      );
    }

    if (!review.response) {
      return NextResponse.json(
        { error: 'Esta review não possui uma resposta para editar' },
        { status: 400 }
      );
    }

    const isProductOwner = review.product?.sellerId === session.user.id;
    const isCourseOwner = review.course?.instructorId === session.user.id;
    const roles = session.user.roles || [];
    const isAdmin = roles.includes('ADMIN');

    if (!isProductOwner && !isCourseOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar esta resposta' },
        { status: 403 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        response: response.trim(),
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

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('[Reviews API] Erro ao editar resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao editar resposta' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id]/response - Deletar resposta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        product: {
          select: {
            sellerId: true,
          },
        },
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review não encontrada' },
        { status: 404 }
      );
    }

    if (!review.response) {
      return NextResponse.json(
        { error: 'Esta review não possui uma resposta' },
        { status: 400 }
      );
    }

    const isProductOwner = review.product?.sellerId === session.user.id;
    const isCourseOwner = review.course?.instructorId === session.user.id;
    const roles = session.user.roles || [];
    const isAdmin = roles.includes('ADMIN');

    if (!isProductOwner && !isCourseOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar esta resposta' },
        { status: 403 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        response: null,
        respondedAt: null,
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

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('[Reviews API] Erro ao deletar resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar resposta' },
      { status: 500 }
    );
  }
}
