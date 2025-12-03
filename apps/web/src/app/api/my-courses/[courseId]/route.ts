import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// GET /api/my-courses/[courseId] - Detalhes do curso para aluno matriculado
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar matrícula
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: params.courseId,
      },
      include: {
        lessonsProgress: true,
        course: {
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
                  },
                },
              },
            },
            category: true,
            modules: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Você não está matriculado neste curso' },
        { status: 403 }
      );
    }

    // Mapear progresso para fácil acesso
    const progressMap = new Map(
      enrollment.lessonsProgress.map((p) => [p.lessonId, p])
    );

    // Adicionar informação de progresso em cada aula
    const modulesWithProgress = enrollment.course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        progress: progressMap.get(lesson.id) || null,
        completed: progressMap.get(lesson.id)?.completed || false,
      })),
    }));

    // Calcular estatísticas
    const totalLessons = enrollment.course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );

    const completedLessons = enrollment.lessonsProgress.filter(
      (p) => p.completed
    ).length;

    const courseData = {
      ...enrollment.course,
      price: Number(enrollment.course.price),
      avgRating: Number(enrollment.course.avgRating),
      modules: modulesWithProgress,
      enrollment: {
        id: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        completedAt: enrollment.completedAt,
        certificateUrl: enrollment.certificateUrl,
        certificateIssuedAt: enrollment.certificateIssuedAt,
      },
      stats: {
        totalLessons,
        completedLessons,
        progress: enrollment.progress,
      },
    };

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar curso' },
      { status: 500 }
    );
  }
}
