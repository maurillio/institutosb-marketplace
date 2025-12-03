import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../auth/[...nextauth]/route';

// PATCH /api/payment-methods/[id]/set-default - Marcar como padrão
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verificar se o método pertence ao usuário
    const paymentMethod = await prisma.savedPaymentMethod.findUnique({
      where: { id },
    });

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Método de pagamento não encontrado' },
        { status: 404 }
      );
    }

    if (paymentMethod.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Remover default dos outros
    await prisma.savedPaymentMethod.updateMany({
      where: {
        userId: session.user.id,
        id: { not: id },
      },
      data: { isDefault: false },
    });

    // Marcar este como default
    const updated = await prisma.savedPaymentMethod.update({
      where: { id },
      data: { isDefault: true },
      select: {
        id: true,
        lastFourDigits: true,
        brand: true,
        cardholderName: true,
        expiryMonth: true,
        expiryYear: true,
        isDefault: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar método padrão:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar método padrão' },
      { status: 500 }
    );
  }
}
