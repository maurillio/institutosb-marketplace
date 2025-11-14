import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';

// POST /api/lessons/[id]/progress - Marcar aula como completada
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
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
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: lesson.module.courseId,
          userId: session.user.id,
        },
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
        lessonId_userId: {
          lessonId,
          userId: session.user.id,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        lessonId,
        userId: session.user.id,
        completed: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(progress);
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

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        lessonId_userId: {
          lessonId: params.id,
          userId: session.user.id,
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
