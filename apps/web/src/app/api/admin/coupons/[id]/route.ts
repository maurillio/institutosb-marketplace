import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET /api/admin/coupons/[id] - Obter cupom específico (admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.roles?.includes('ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            usages: true,
          },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      ...coupon,
      value: Number(coupon.value),
      minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    });
  } catch (error) {
    console.error('Erro ao buscar cupom:', error);
    return NextResponse.json({ error: 'Erro ao buscar cupom' }, { status: 500 });
  }
}

// PATCH /api/admin/coupons/[id] - Atualizar cupom (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.roles?.includes('ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const {
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      applicability,
      categoryIds,
      productIds,
      maxUses,
      maxUsesPerUser,
      validFrom,
      validUntil,
      description,
      isActive,
    } = body;

    // Verificar se cupom existe
    const existing = await prisma.coupon.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 });
    }

    // Se está alterando o código, verificar se já existe outro com esse código
    if (code && code !== existing.code) {
      const duplicateCode = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (duplicateCode) {
        return NextResponse.json(
          { error: 'Código de cupom já existe' },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização (somente campos fornecidos)
    const updateData: any = {};

    if (code !== undefined) updateData.code = code.toUpperCase();
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (minOrderValue !== undefined) updateData.minOrderValue = minOrderValue || null;
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount || null;
    if (applicability !== undefined) updateData.applicability = applicability;
    if (categoryIds !== undefined) updateData.categoryIds = categoryIds;
    if (productIds !== undefined) updateData.productIds = productIds;
    if (maxUses !== undefined) updateData.maxUses = maxUses || null;
    if (maxUsesPerUser !== undefined) updateData.maxUsesPerUser = maxUsesPerUser || null;
    if (validFrom !== undefined) updateData.validFrom = new Date(validFrom);
    if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null;
    if (description !== undefined) updateData.description = description || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      ...coupon,
      value: Number(coupon.value),
      minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    });
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    return NextResponse.json({ error: 'Erro ao atualizar cupom' }, { status: 500 });
  }
}

// DELETE /api/admin/coupons/[id] - Deletar cupom (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.roles?.includes('ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    // Verificar se cupom existe
    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            usages: true,
            orders: true,
          },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 });
    }

    // Verificar se há pedidos usando este cupom
    if (coupon._count.orders > 0) {
      return NextResponse.json(
        {
          error: 'Não é possível deletar cupom que já foi usado em pedidos. Desative-o ao invés de deletar.'
        },
        { status: 400 }
      );
    }

    // Se houver apenas registros de uso sem pedidos associados, deletar tudo em cascata
    await prisma.coupon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Cupom deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cupom:', error);
    return NextResponse.json({ error: 'Erro ao deletar cupom' }, { status: 500 });
  }
}
