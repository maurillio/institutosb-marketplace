import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';
import { startOfDay, endOfDay, subDays } from 'date-fns';

// Forçar rota dinâmica (necessário para getServerSession)
export const dynamic = 'force-dynamic';

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
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Datas padrão: últimos 30 dias
    const startDate = startDateParam
      ? new Date(startDateParam)
      : startOfDay(subDays(new Date(), 30));
    const endDate = endDateParam
      ? new Date(endDateParam)
      : endOfDay(new Date());

    // Total de cursos
    const totalCourses = await prisma.course.count({
      where: {
        status: 'PUBLISHED',
      },
    });

    // Total de matrículas
    const totalEnrollments = await prisma.enrollment.count();

    // Matrículas no período
    const enrollmentsInPeriod = await prisma.enrollment.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calcular rating médio de todos os cursos
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    let totalRatings = 0;
    let ratingCount = 0;

    courses.forEach((course) => {
      course.reviews.forEach((review) => {
        totalRatings += review.rating;
        ratingCount++;
      });
    });

    const avgRating = ratingCount > 0 ? totalRatings / ratingCount : 0;

    // Calcular receita total de cursos
    const enrollmentsWithPrice = await prisma.enrollment.findMany({
      include: {
        course: {
          select: {
            price: true,
          },
        },
      },
    });

    const revenue = enrollmentsWithPrice.reduce(
      (sum, enrollment) => sum + Number(enrollment.course.price),
      0
    );

    // Top Cursos (por matrículas)
    const topCoursesByEnrollments = courses
      .map((course) => ({
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        enrollments: course.enrollments.length,
        revenue: Number(course.price) * course.enrollments.length,
        avgRating: course.reviews.length > 0
          ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
          : 0,
      }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 10);

    // Top Cursos (por receita)
    const topCoursesByRevenue = courses
      .map((course) => ({
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        enrollments: course.enrollments.length,
        revenue: Number(course.price) * course.enrollments.length,
        avgRating: course.reviews.length > 0
          ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
          : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Top Instrutores
    const instructorStats = new Map<string, {
      id: string;
      name: string;
      avatar: string | null;
      courses: number;
      enrollments: number;
      revenue: number;
    }>();

    courses.forEach((course) => {
      const instructorId = course.instructor.id;
      const existing = instructorStats.get(instructorId) || {
        id: instructorId,
        name: course.instructor.name,
        avatar: course.instructor.avatar,
        courses: 0,
        enrollments: 0,
        revenue: 0,
      };

      existing.courses += 1;
      existing.enrollments += course.enrollments.length;
      existing.revenue += Number(course.price) * course.enrollments.length;

      instructorStats.set(instructorId, existing);
    });

    const topInstructors = Array.from(instructorStats.values())
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 10);

    // Cursos por tipo
    const coursesByType = await prisma.course.groupBy({
      by: ['type'],
      where: {
        status: 'PUBLISHED',
      },
      _count: {
        _all: true,
      },
    });

    const typeCounts = coursesByType.reduce((acc, item) => {
      acc[item.type] = item._count._all;
      return acc;
    }, {} as Record<string, number>);

    // Cursos por nível
    const coursesByLevel = await prisma.course.groupBy({
      by: ['level'],
      where: {
        status: 'PUBLISHED',
      },
      _count: {
        _all: true,
      },
    });

    const levelCounts = coursesByLevel.reduce((acc, item) => {
      acc[item.level] = item._count._all;
      return acc;
    }, {} as Record<string, number>);

    // Resposta
    return NextResponse.json({
      summary: {
        totalCourses,
        totalEnrollments,
        enrollmentsInPeriod,
        avgRating,
        revenue,
        byType: typeCounts,
        byLevel: levelCounts,
      },
      topCoursesByEnrollments,
      topCoursesByRevenue,
      topInstructors,
    });
  } catch (error) {
    console.error('[Admin Reports API] Erro ao buscar relatório de cursos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar relatório de cursos' },
      { status: 500 }
    );
  }
}
