import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/admin/coupons - Listar cupons (admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.roles?.includes('ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // 'active', 'inactive', 'expired'

    const skip = (page - 1) * limit;

    // Filtros
    const where: any = {};
    const now = new Date();

    if (status === 'active') {
      where.isActive = true;
      where.validFrom = { lte: now };
      where.OR = [
        { validUntil: null },
        { validUntil: { gte: now } }
      ];
    } else if (status === 'inactive') {
      where.isActive = false;
    } else if (status === 'expired') {
      where.validUntil = { lt: now };
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              usages: true,
            },
          },
        },
      }),
      prisma.coupon.count({ where }),
    ]);

    // Converter Decimal para Number
    const couponsData = coupons.map((coupon) => ({
      ...coupon,
      value: Number(coupon.value),
      minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    }));

    return NextResponse.json({
      coupons: couponsData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao listar cupons:', error);
    return NextResponse.json({ error: 'Erro ao listar cupons' }, { status: 500 });
  }
}

// POST /api/admin/coupons - Criar cupom (admin only)
export async function POST(request: Request) {
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
    } = body;

    // Validações
    if (!code || !type || !value || !validFrom) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verificar se código já existe
    const existing = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Código de cupom já existe' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
        minOrderValue: minOrderValue || null,
        maxDiscount: maxDiscount || null,
        applicability: applicability || 'ALL_PRODUCTS',
        categoryIds: categoryIds || [],
        productIds: productIds || [],
        maxUses: maxUses || null,
        maxUsesPerUser: maxUsesPerUser || null,
        validFrom: new Date(validFrom),
        validUntil: validUntil ? new Date(validUntil) : null,
        description: description || null,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({
      ...coupon,
      value: Number(coupon.value),
      minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    return NextResponse.json({ error: 'Erro ao criar cupom' }, { status: 500 });
  }
}
