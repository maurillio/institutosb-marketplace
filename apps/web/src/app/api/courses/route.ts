import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// GET /api/courses - Listar cursos públicos com filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type'); // ONLINE ou PRESENCIAL
    const level = searchParams.get('level');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    const where: any = {
      status: 'PUBLISHED', // Apenas cursos publicados
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

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

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          instructor: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
              rating: true,
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
