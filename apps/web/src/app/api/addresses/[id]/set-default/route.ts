import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../auth/[...nextauth]/route';

// PATCH /api/addresses/[id]/set-default - Marcar endereço como padrão
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const address = await prisma.address.findUnique({
      where: { id: params.id },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Endereço não encontrado' },
        { status: 404 }
      );
    }

    if (address.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para modificar este endereço' },
        { status: 403 }
      );
    }

    // Desmarcar todos os outros endereços como padrão
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Marcar este como padrão
    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Erro ao definir endereço padrão:', error);
    return NextResponse.json(
      { error: 'Erro ao definir endereço padrão' },
      { status: 500 }
    );
  }
}
