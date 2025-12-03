import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/payment-methods - Listar métodos de pagamento salvos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const paymentMethods = await prisma.savedPaymentMethod.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
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

    return NextResponse.json({ paymentMethods });
  } catch (error) {
    console.error('Erro ao listar métodos de pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao listar métodos de pagamento' },
      { status: 500 }
    );
  }
}

// POST /api/payment-methods - Adicionar novo método de pagamento
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      cardToken,
      lastFourDigits,
      brand,
      cardholderName,
      expiryMonth,
      expiryYear,
      setAsDefault,
    } = body;

    // Validações
    if (!cardToken || !lastFourDigits || !brand || !cardholderName || !expiryMonth || !expiryYear) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Validar formato de data
    const month = parseInt(expiryMonth);
    const year = parseInt(expiryYear);
    if (month < 1 || month > 12 || year < new Date().getFullYear()) {
      return NextResponse.json(
        { error: 'Data de validade inválida' },
        { status: 400 }
      );
    }

    // Se setAsDefault, remover default dos outros
    if (setAsDefault) {
      await prisma.savedPaymentMethod.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    // Verificar se é o primeiro método (auto-default)
    const count = await prisma.savedPaymentMethod.count({
      where: { userId: session.user.id },
    });
    const isFirst = count === 0;

    const paymentMethod = await prisma.savedPaymentMethod.create({
      data: {
        userId: session.user.id,
        cardToken,
        lastFourDigits,
        brand: brand.toLowerCase(),
        cardholderName,
        expiryMonth: expiryMonth.padStart(2, '0'),
        expiryYear: expiryYear.toString(),
        isDefault: setAsDefault || isFirst,
      },
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

    return NextResponse.json(paymentMethod, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar método de pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar método de pagamento' },
      { status: 500 }
    );
  }
}
