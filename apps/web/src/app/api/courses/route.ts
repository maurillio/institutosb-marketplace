import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// Forçar rota dinâmica (necessário para request.url)
export const dynamic = 'force-dynamic';

// GET /api/courses - Listar cursos públicos com filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const type = searchParams.get('type'); // ONLINE ou PRESENCIAL
    const level = searchParams.get('level');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    const where: any = {
      status: 'PUBLISHED', // Apenas cursos publicados
    };

    if (type) {
      where.type = type;
    }

    if (level) {
      where.level = level;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

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

    // Converter Decimal para Number
    const courses = coursesRaw.map((course) => ({
      ...course,
      price: Number(course.price),
      compareAtPrice: course.compareAtPrice ? Number(course.compareAtPrice) : null,
      instructor: {
        ...course.instructor,
        instructorProfile: course.instructor.instructorProfile ? {
          rating: course.instructor.instructorProfile.rating ? Number(course.instructor.instructorProfile.rating) : null,
        } : null,
      },
    }));

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
    console.error('Erro ao buscar cursos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    );
  }
}
