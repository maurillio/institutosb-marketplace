import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

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
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const instructorId = searchParams.get('instructorId');
    const search = searchParams.get('search');

    // Construir filtros dinâmicos
    const where: any = {};

    // Filtros
    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (level) {
      where.level = level;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    // Busca por título ou descrição
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar cursos com relacionamentos
    const [coursesRaw, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true,
              instructorProfile: {
                select: {
                  rating: true,
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true,
              modules: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    // Converter Decimal para Number e formatar datas
    const courses = coursesRaw.map((course) => ({
      ...course,
      price: Number(course.price),
      compareAtPrice: course.compareAtPrice ? Number(course.compareAtPrice) : null,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      publishedAt: course.publishedAt?.toISOString() || null,
      instructor: {
        ...course.instructor,
        instructorProfile: course.instructor.instructorProfile
          ? {
              rating: course.instructor.instructorProfile.rating
                ? Number(course.instructor.instructorProfile.rating)
                : null,
            }
          : null,
      },
    }));

    // Resposta com paginação
    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Admin Courses API] Erro ao buscar cursos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    );
  }
}
