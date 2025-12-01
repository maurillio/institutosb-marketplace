import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../../auth/[...nextauth]/route';

// PUT /api/instructor/courses/[id]/modules - Atualizar módulos e aulas do curso
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('INSTRUCTOR') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente instrutores.' },
        { status: 403 }
      );
    }

    // Verificar se o curso pertence ao instrutor
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: params.id,
        instructorId: session.user.id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { modules } = body;

    console.log('[Modules API] Atualizando módulos do curso:', params.id);
    console.log('[Modules API] Módulos recebidos:', modules.length);

    // Usar transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      // 1. Deletar todos os módulos existentes (cascade vai deletar as aulas)
      await tx.courseModule.deleteMany({
        where: { courseId: params.id },
      });

      // 2. Criar novos módulos com suas aulas
      for (const module of modules) {
        const createdModule = await tx.courseModule.create({
          data: {
            courseId: params.id,
            title: module.title,
            description: module.description || null,
            order: module.order,
          },
        });

        // Criar aulas do módulo
        if (module.lessons && module.lessons.length > 0) {
          for (const lesson of module.lessons) {
            await tx.courseLesson.create({
              data: {
                moduleId: createdModule.id,
                title: lesson.title,
                description: lesson.description || null,
                order: lesson.order,
                videoUrl: lesson.videoUrl || null,
                duration: lesson.duration || null,
                isFree: lesson.isFree || false,
              },
            });
          }
        }
      }
    });

    console.log('[Modules API] Módulos atualizados com sucesso');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Modules API] Erro ao atualizar módulos:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar módulos' },
      { status: 500 }
    );
  }
}
