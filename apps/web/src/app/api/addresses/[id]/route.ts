import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/addresses/[id] - Buscar endereço específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const address = await prisma.address.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Endereço não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o endereço pertence ao usuário
    if (address.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar este endereço' },
        { status: 403 }
      );
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar endereço' },
      { status: 500 }
    );
  }
}

// PATCH /api/addresses/[id] - Atualizar endereço
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
        { error: 'Sem permissão para editar este endereço' },
        { status: 403 }
      );
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

    // Se marcar como padrão, desmarcar os outros
    if (isDefault && !address.isDefault) {
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

    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: {
        label: label ?? address.label,
        street: street ?? address.street,
        number: number ?? address.number,
        complement: complement !== undefined ? complement : address.complement,
        neighborhood: neighborhood ?? address.neighborhood,
        city: city ?? address.city,
        state: state ?? address.state,
        zipCode: zipCode ?? address.zipCode,
        country: country ?? address.country,
        isDefault: isDefault ?? address.isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar endereço' },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses/[id] - Deletar endereço
export async function DELETE(
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
        { error: 'Sem permissão para deletar este endereço' },
        { status: 403 }
      );
    }

    // Verificar se há pedidos usando este endereço
    const ordersCount = await prisma.order.count({
      where: { addressId: params.id },
    });

    if (ordersCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar endereço com pedidos vinculados' },
        { status: 400 }
      );
    }

    // Se for o padrão, marcar outro como padrão antes de deletar
    if (address.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: {
          userId: session.user.id,
          id: { not: params.id },
        },
      });

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.address.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Endereço deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar endereço' },
      { status: 500 }
    );
  }
}
