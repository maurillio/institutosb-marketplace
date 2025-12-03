import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';
import { checkInstructorCourseLimit } from '@/lib/subscription/limits';

// GET /api/instructor/courses - Listar cursos do instrutor
export async function GET(request: Request) {
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

    let instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Criar perfil automaticamente se não existir
    if (!instructorProfile) {
      instructorProfile = await prisma.instructorProfile.create({
        data: {
          userId: session.user.id,
        },
      });
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

    // Converter Decimal para Number
    const coursesWithNumbers = courses.map((course) => ({
      ...course,
      price: Number(course.price),
      compareAtPrice: course.compareAtPrice ? Number(course.compareAtPrice) : null,
      rating: Number(course.rating),
    }));

    return NextResponse.json(coursesWithNumbers);
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

    let instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Criar perfil automaticamente se não existir
    if (!instructorProfile) {
      instructorProfile = await prisma.instructorProfile.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    // Verificar limite de cursos do plano
    const limitCheck = await checkInstructorCourseLimit(session.user.id);
    if (!limitCheck.canCreateCourse) {
      return NextResponse.json(
        {
          error: limitCheck.reason || 'Limite de cursos atingido',
          currentCount: limitCheck.currentCount,
          maxAllowed: limitCheck.maxAllowed,
        },
        { status: 403 }
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

    // Converter duration para inteiro ou null
    const durationInt = duration && duration !== '' ? parseInt(duration, 10) : null;

    console.log('[Create Course API] Dados recebidos:', {
      title,
      slug,
      type,
      price,
      duration: duration,
      durationInt,
      level,
      status,
    });

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        instructorId: session.user.id,
        thumbnail: thumbnail || null,
        type, // ONLINE, IN_PERSON ou HYBRID
        duration: durationInt,
        level: level || 'ALL_LEVELS',
        status: status || 'DRAFT',
      },
    });

    console.log('[Create Course API] Curso criado com sucesso:', course.id);

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('[Create Course API] Erro ao criar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    );
  }
}
