import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// POST /api/lessons/[lessonId]/progress - Marcar aula como concluída
export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar a aula e o curso
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: params.lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      );
    }

    const course = lesson.module.course;

    // Verificar se o usuário está matriculado
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: course.id,
      },
      include: {
        lessonsProgress: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Você não está matriculado neste curso' },
        { status: 403 }
      );
    }

    // Verificar se já existe progresso para esta aula
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: params.lessonId,
        },
      },
    });

    let lessonProgress;

    if (existingProgress) {
      // Se já estava completa, não faz nada
      if (existingProgress.completed) {
        return NextResponse.json({
          ...existingProgress,
          message: 'Aula já estava concluída',
        });
      }

      // Atualizar para completo
      lessonProgress = await prisma.lessonProgress.update({
        where: { id: existingProgress.id },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
    } else {
      // Criar novo progresso
      lessonProgress = await prisma.lessonProgress.create({
        data: {
          enrollmentId: enrollment.id,
          lessonId: params.lessonId,
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    // Calcular o progresso total do curso
    const totalLessons = course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );

    const completedLessonsCount = await prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        completed: true,
      },
    });

    const progressPercentage = Math.round(
      (completedLessonsCount / totalLessons) * 100
    );

    // Atualizar progresso da matrícula
    const updatedEnrollment = await prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercentage,
        // Se 100%, marcar como concluído e gerar certificado
        ...(progressPercentage === 100 && !enrollment.completedAt
          ? {
              completedAt: new Date(),
              // TODO: Gerar certificado aqui
              // certificateUrl: await generateCertificate(enrollment.id),
              // certificateIssuedAt: new Date(),
            }
          : {}),
      },
    });

    return NextResponse.json({
      lessonProgress,
      enrollment: {
        id: updatedEnrollment.id,
        progress: updatedEnrollment.progress,
        completedAt: updatedEnrollment.completedAt,
        certificateUrl: updatedEnrollment.certificateUrl,
      },
      completedLessons: completedLessonsCount,
      totalLessons,
      message:
        progressPercentage === 100
          ? 'Parabéns! Você concluiu o curso!'
          : 'Aula marcada como concluída',
    });
  } catch (error) {
    console.error('Erro ao marcar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao marcar progresso' },
      { status: 500 }
    );
  }
}

// GET /api/lessons/[lessonId]/progress - Buscar progresso da aula
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar a aula
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: params.lessonId },
      include: {
        module: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      );
    }

    // Buscar matrícula
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: lesson.module.courseId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { completed: false, progress: null },
        { status: 200 }
      );
    }

    // Buscar progresso
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: params.lessonId,
        },
      },
    });

    return NextResponse.json({
      completed: progress?.completed || false,
      completedAt: progress?.completedAt || null,
      progress,
    });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar progresso' },
      { status: 500 }
    );
  }
}
