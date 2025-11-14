import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// GET /api/courses/[id] - Buscar detalhes completos de um curso
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            instructorProfile: {
              select: {
                bio: true,
                rating: true,
                totalStudents: true,
              },
            },
          },
        },
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                duration: true,
                order: true,
                isFree: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        schedules: {
          where: {
            date: {
              gte: new Date(), // Apenas agendamentos futuros
            },
          },
          orderBy: {
            date: 'asc',
          },
          take: 10,
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
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

    // Calcular média de avaliações
    const avgRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : 0;

    // Calcular duração total do curso (soma das aulas)
    const totalDuration = course.modules.reduce((total, module) => {
      return total + module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    }, 0);

    return NextResponse.json({
      ...course,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalDuration,
      totalLessons: course.modules.reduce((sum, m) => sum + m.lessons.length, 0),
    });
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar curso' },
      { status: 500 }
    );
  }
}
