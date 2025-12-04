import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// Forçar rota dinâmica (necessário para request.url)
export const dynamic = 'force-dynamic';

// GET /api/search - Busca global (produtos e cursos)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type'); // 'products', 'courses', ou null para ambos
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json({
        products: [],
        courses: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const skip = (page - 1) * limit;

    // Buscar produtos (se type não for 'courses')
    let products: any[] = [];
    let totalProducts = 0;

    if (!type || type === 'products') {
      const searchWhere = {
        AND: [
          { status: 'ACTIVE' as const },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' as const } },
              { description: { contains: query, mode: 'insensitive' as const } },
              {
                category: {
                  name: { contains: query, mode: 'insensitive' as const },
                },
              },
            ],
          },
        ],
      };

      [products, totalProducts] = await Promise.all([
        prisma.product.findMany({
          where: searchWhere,
          include: {
            category: { select: { name: true, slug: true } },
            seller: {
              include: {
                sellerProfile: {
                  select: { businessName: true, rating: true },
                },
              },
            },
            _count: { select: { reviews: true, orderItems: true } },
          },
          skip: type === 'products' ? skip : 0,
          take: type === 'products' ? limit : limit / 2,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where: searchWhere }),
      ]);

      // Converter Decimal para Number
      products = products.map((p) => ({
        ...p,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        seller: p.seller
          ? {
              ...p.seller,
              sellerProfile: p.seller.sellerProfile
                ? {
                    ...p.seller.sellerProfile,
                    rating: p.seller.sellerProfile.rating
                      ? Number(p.seller.sellerProfile.rating)
                      : null,
                  }
                : null,
            }
          : null,
      }));
    }

    // Buscar cursos (se type não for 'products')
    let courses: any[] = [];
    let totalCourses = 0;

    if (!type || type === 'courses') {
      const searchWhere = {
        AND: [
          { status: 'PUBLISHED' as const },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' as const } },
              { description: { contains: query, mode: 'insensitive' as const } },
            ],
          },
        ],
      };

      [courses, totalCourses] = await Promise.all([
        prisma.course.findMany({
          where: searchWhere,
          include: {
            instructor: {
              include: {
                instructorProfile: {
                  select: { bio: true, rating: true },
                },
              },
            },
            _count: { select: { enrollments: true, reviews: true } },
          },
          skip: type === 'courses' ? skip : 0,
          take: type === 'courses' ? limit : limit / 2,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.course.count({ where: searchWhere }),
      ]);

      // Converter Decimal para Number
      courses = courses.map((c) => ({
        ...c,
        price: c.price ? Number(c.price) : null,
        duration: c.duration ? Number(c.duration) : null,
        instructor: c.instructor
          ? {
              ...c.instructor,
              instructorProfile: c.instructor.instructorProfile
                ? {
                    ...c.instructor.instructorProfile,
                    rating: c.instructor.instructorProfile.rating
                      ? Number(c.instructor.instructorProfile.rating)
                      : null,
                  }
                : null,
            }
          : null,
      }));
    }

    // Calcular paginação
    const total =
      !type ? totalProducts + totalCourses : type === 'products' ? totalProducts : totalCourses;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats: {
        totalProducts,
        totalCourses,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar:', error);
    return NextResponse.json({ error: 'Erro ao realizar busca' }, { status: 500 });
  }
}
