import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar se o usuário é ADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Apenas administradores podem alterar roles' },
        { status: 403 }
      );
    }

    const { roles } = await request.json();

    // Validar roles
    const validRoles = ['CUSTOMER', 'SELLER', 'INSTRUCTOR', 'ADMIN'];
    const invalidRoles = roles.filter((role: string) => !validRoles.includes(role));

    if (invalidRoles.length > 0) {
      return NextResponse.json(
        { error: `Roles inválidos: ${invalidRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Atualizar roles do usuário
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { roles },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });

    return NextResponse.json({
      message: 'Roles atualizados com sucesso',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erro ao atualizar roles:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar roles' },
      { status: 500 }
    );
  }
}
