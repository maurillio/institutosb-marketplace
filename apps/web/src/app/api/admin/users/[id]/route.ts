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
    const { status: newStatus } = body;

    // Validação: não permitir desativar própria conta
    if (params.id === session.user.id && newStatus === 'INACTIVE') {
      return NextResponse.json(
        { error: 'Você não pode desativar sua própria conta' },
        { status: 400 }
      );
    }

    // Validar status permitidos
    const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];
    if (newStatus && !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Buscar usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        roles: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Validação: não permitir remover último ADMIN
    if (currentUser.roles.includes('ADMIN')) {
      const adminCount = await prisma.user.count({
        where: {
          roles: { has: 'ADMIN' },
          status: 'ACTIVE',
        },
      });

      if (adminCount === 1 && newStatus !== 'ACTIVE') {
        return NextResponse.json(
          { error: 'Não é possível desativar o último administrador ativo' },
          { status: 400 }
        );
      }
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { status: newStatus },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        roles: true,
      },
    });

    return NextResponse.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser,
    });
  } catch (error) {
    console.error('[Admin Users API] Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
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

    // Validação: não permitir deletar própria conta
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'Você não pode deletar sua própria conta' },
        { status: 400 }
      );
    }

    // Soft delete (atualizar status para INACTIVE)
    await prisma.user.update({
      where: { id: params.id },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json({
      message: 'Usuário desativado com sucesso',
    });
  } catch (error) {
    console.error('[Admin Users API] Erro ao deletar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}
