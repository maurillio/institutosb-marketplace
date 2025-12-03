import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// POST /api/coupons/validate - Validar cupom
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { code, orderTotal, productIds, categoryIds } = body;

    if (!code) {
      return NextResponse.json({ error: 'Código do cupom é obrigatório' }, { status: 400 });
    }

    // Buscar cupom
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Cupom não encontrado', valid: false },
        { status: 404 }
      );
    }

    // Validações
    const now = new Date();
    const errors: string[] = [];

    // 1. Cupom ativo
    if (!coupon.isActive) {
      errors.push('Cupom inativo');
    }

    // 2. Data de validade
    if (coupon.validFrom > now) {
      errors.push('Cupom ainda não está válido');
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      errors.push('Cupom expirado');
    }

    // 3. Limite de usos total
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      errors.push('Cupom esgotado');
    }

    // 4. Limite de usos por usuário
    if (coupon.maxUsesPerUser) {
      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId: session.user.id,
        },
      });

      if (userUsageCount >= coupon.maxUsesPerUser) {
        errors.push('Você já atingiu o limite de usos deste cupom');
      }
    }

    // 5. Valor mínimo do pedido
    if (coupon.minOrderValue && orderTotal < Number(coupon.minOrderValue)) {
      errors.push(`Pedido mínimo de R$ ${Number(coupon.minOrderValue).toFixed(2)}`);
    }

    // 6. Aplicabilidade (produtos/categorias específicos)
    if (coupon.applicability === 'SPECIFIC_CATEGORIES' && categoryIds) {
      const hasMatch = categoryIds.some((id: string) => coupon.categoryIds.includes(id));
      if (!hasMatch) {
        errors.push('Cupom não aplicável a estes produtos');
      }
    }

    if (coupon.applicability === 'SPECIFIC_PRODUCTS' && productIds) {
      const hasMatch = productIds.some((id: string) => coupon.productIds.includes(id));
      if (!hasMatch) {
        errors.push('Cupom não aplicável a estes produtos');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        valid: false,
        error: errors[0],
        errors,
      });
    }

    // Calcular desconto
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = orderTotal * (Number(coupon.value) / 100);
      // Aplicar desconto máximo se definido
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      // FIXED_AMOUNT
      discountAmount = Number(coupon.value);
      // Desconto não pode ser maior que o total
      if (discountAmount > orderTotal) {
        discountAmount = orderTotal;
      }
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        description: coupon.description,
      },
      discountAmount,
      finalTotal: orderTotal - discountAmount,
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    return NextResponse.json(
      { error: 'Erro ao validar cupom', valid: false },
      { status: 500 }
    );
  }
}
