import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';

// GET /api/instructor/courses - Listar cursos do instrutor
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('INSTRUCTOR') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente instrutores.' },
        { status: 403 }
      );
    }

    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructorProfile) {
      return NextResponse.json(
        { error: 'Perfil de instrutor não encontrado' },
        { status: 404 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        instructorId: session.user.id,
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    );
  }
}

// POST /api/instructor/courses - Criar novo curso
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('INSTRUCTOR') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente instrutores.' },
        { status: 403 }
      );
    }

    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructorProfile) {
      return NextResponse.json(
        { error: 'Perfil de instrutor não encontrado' },
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

    if (!title || !slug || !description || !price || !type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        price: parseFloat(price),
        instructorId: session.user.id,
        thumbnail: thumbnail || null,
        type, // ONLINE ou PRESENCIAL
        duration: duration || null,
        level: level || 'ALL_LEVELS',
        status: status || 'DRAFT',
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    );
  }
}
