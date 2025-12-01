import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET /api/instructor/courses/[id] - Buscar curso específico do instrutor
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('INSTRUCTOR') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente instrutores.' },
        { status: 403 }
      );
    }

    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        instructorId: session.user.id,
      },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    // Converter Decimal para Number
    const courseWithNumbers = {
      ...course,
      price: Number(course.price),
      compareAtPrice: course.compareAtPrice ? Number(course.compareAtPrice) : null,
      rating: Number(course.rating),
    };

    return NextResponse.json(courseWithNumbers);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar curso' },
      { status: 500 }
    );
  }
}

// PUT /api/instructor/courses/[id] - Atualizar curso
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('INSTRUCTOR') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente instrutores.' },
        { status: 403 }
      );
    }

    // Verificar se o curso pertence ao instrutor
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: params.id,
        instructorId: session.user.id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      shortDescription,
      price,
      thumbnail,
      type,
      duration,
      level,
      status,
    } = body;

    // Converter duration para inteiro ou null
    const durationInt = duration && duration !== '' ? parseInt(duration, 10) : null;

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(shortDescription !== undefined && { shortDescription: shortDescription || null }),
        ...(price && { price: parseFloat(price) }),
        ...(thumbnail !== undefined && { thumbnail: thumbnail || null }),
        ...(type && { type }),
        ...(duration !== undefined && { duration: durationInt }),
        ...(level && { level }),
        ...(status && { status }),
      },
    });

    // Converter Decimal para Number
    const courseWithNumbers = {
      ...course,
      price: Number(course.price),
      compareAtPrice: course.compareAtPrice ? Number(course.compareAtPrice) : null,
      rating: Number(course.rating),
    };

    return NextResponse.json(courseWithNumbers);
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar curso' },
      { status: 500 }
    );
  }
}

// DELETE /api/instructor/courses/[id] - Deletar curso
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('INSTRUCTOR') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente instrutores.' },
        { status: 403 }
      );
    }

    // Verificar se o curso pertence ao instrutor
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: params.id,
        instructorId: session.user.id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Soft delete (mudar status para ARCHIVED)
    await prisma.course.update({
      where: { id: params.id },
      data: { status: 'ARCHIVED' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar curso' },
      { status: 500 }
    );
  }
}
