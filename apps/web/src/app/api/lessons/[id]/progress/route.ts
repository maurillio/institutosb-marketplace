import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../auth/[...nextauth]/route';

// POST /api/lessons/[id]/progress - Marcar aula como completada
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const lessonId = params.id;

    // Verificar se a aula existe
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          select: {
            courseId: true,
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

    // Verificar se está matriculado no curso
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId: lesson.module.courseId,
        userId: session.user.id,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Você não está matriculado neste curso' },
        { status: 403 }
      );
    }

    // Criar ou atualizar progresso
    const progress = await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Calcular progresso total do curso
    const totalLessons = await prisma.courseLesson.count({
      where: {
        module: {
          courseId: lesson.module.courseId,
        },
      },
    });

    const completedLessonsCount = await prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        completed: true,
      },
    });

    const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

    // Atualizar progresso da matrícula
    const updatedEnrollment = await prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercentage,
        ...(progressPercentage === 100 && !enrollment.completedAt
          ? {
              completedAt: new Date(),
              // TODO: Gerar certificado
            }
          : {}),
      },
    });

    return NextResponse.json({
      progress,
      enrollment: updatedEnrollment,
      message:
        progressPercentage === 100
          ? 'Parabéns! Você concluiu o curso!'
          : 'Aula marcada como concluída!',
    });
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar progresso' },
      { status: 500 }
    );
  }
}

// GET /api/lessons/[id]/progress - Buscar progresso da aula
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const lessonId = params.id;

    // Buscar a aula para obter o courseId
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ completed: false });
    }

    // Buscar a matrícula do usuário
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId: lesson.module.courseId,
        userId: session.user.id,
      },
    });

    if (!enrollment) {
      return NextResponse.json({ completed: false });
    }

    // Buscar o progresso
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
    });

    return NextResponse.json(progress || { completed: false });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar progresso' },
      { status: 500 }
    );
  }
}
