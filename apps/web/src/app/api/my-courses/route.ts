import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';

// GET /api/my-courses - Listar cursos matriculados do usuário
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
                avatar: true,
              },
            },
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    // Calcular progresso de cada curso
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = enrollment.course.modules.reduce(
          (sum, module) => sum + module.lessons.length,
          0
        );

        const completedLessons = await prisma.lessonProgress.count({
          where: {
            enrollmentId: enrollment.id,
            completed: true,
          },
        });

        const progress = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        return {
          ...enrollment,
          progress,
          totalLessons,
          completedLessons,
        };
      })
    );

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.error('Erro ao buscar cursos matriculados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    );
  }
}
