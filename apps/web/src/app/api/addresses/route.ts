import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/addresses - Listar todos os endereços do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { isDefault: 'desc' }, // Default primeiro
        { createdAt: 'desc' }, // Mais recente depois
      ],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar endereços' },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Criar novo endereço
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      label,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      country,
      isDefault,
    } = body;

    // Validações
    if (!label || !street || !number || !neighborhood || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Se for para marcar como padrão, desmarcar o atual
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Se não tiver nenhum endereço, este será o padrão
    const existingCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        street,
        number,
        complement: complement || null,
        neighborhood,
        city,
        state,
        zipCode,
        country: country || 'Brasil',
        isDefault: existingCount === 0 ? true : (isDefault || false),
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    return NextResponse.json(
      { error: 'Erro ao criar endereço' },
      { status: 500 }
    );
  }
}
