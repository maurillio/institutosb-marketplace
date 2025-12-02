import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json();
    const { status: newStatus, reason } = body;

    // Validar status permitidos
    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (newStatus && !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Buscar curso
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
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

    // Validações específicas por ação
    if (newStatus === 'PUBLISHED') {
      // Aprovar curso: validar se tem thumbnail
      if (!course.thumbnail) {
        return NextResponse.json(
          { error: 'Curso precisa ter uma thumbnail para ser publicado' },
          { status: 400 }
        );
      }

      // Para cursos online, validar se tem módulos e aulas
      if (course.type === 'ONLINE') {
        if (course.modules.length === 0) {
          return NextResponse.json(
            { error: 'Curso online precisa ter pelo menos um módulo' },
            { status: 400 }
          );
        }

        const totalLessons = course.modules.reduce(
          (sum, module) => sum + module.lessons.length,
          0
        );

        if (totalLessons === 0) {
          return NextResponse.json(
            { error: 'Curso online precisa ter pelo menos uma aula' },
            { status: 400 }
          );
        }
      }
    }

    // Atualizar curso
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        publishedAt: newStatus === 'PUBLISHED' ? new Date() : course.publishedAt,
      },
      select: {
        id: true,
        title: true,
        status: true,
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Enviar notificação ao instrutor
    // Se aprovado: "Seu curso foi publicado!"
    // Se reprovado: "Seu curso foi arquivado. Motivo: {reason}"

    const statusMessages: Record<string, string> = {
      PUBLISHED: 'Curso publicado com sucesso',
      ARCHIVED: 'Curso arquivado com sucesso',
      DRAFT: 'Curso movido para rascunho',
    };

    return NextResponse.json({
      message: statusMessages[newStatus] || 'Curso atualizado com sucesso',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('[Admin Courses API] Erro ao atualizar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar curso' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Buscar curso
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            enrollments: true,
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

    // Validação: não permitir deletar se houver matrículas
    if (course._count.enrollments > 0) {
      return NextResponse.json(
        {
          error: 'Não é possível deletar curso com matrículas. Arquive o curso ao invés de deletar.',
        },
        { status: 400 }
      );
    }

    // Deletar curso (hard delete) - cascade vai deletar módulos e aulas
    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Curso deletado com sucesso',
    });
  } catch (error) {
    console.error('[Admin Courses API] Erro ao deletar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar curso' },
      { status: 500 }
    );
  }
}
