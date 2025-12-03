import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// DELETE /api/payment-methods/[id] - Remover método de pagamento
export async function DELETE(
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

    // Se era o default, marcar outro como default
    if (paymentMethod.isDefault) {
      const otherMethod = await prisma.savedPaymentMethod.findFirst({
        where: {
          userId: session.user.id,
          id: { not: id },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (otherMethod) {
        await prisma.savedPaymentMethod.update({
          where: { id: otherMethod.id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.savedPaymentMethod.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover método de pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao remover método de pagamento' },
      { status: 500 }
    );
  }
}
