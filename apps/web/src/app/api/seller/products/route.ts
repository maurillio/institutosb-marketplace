import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/seller/products - Listar produtos do vendedor
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar se o usuário é vendedor
    if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente vendedores.' },
        { status: 403 }
      );
    }

    // Buscar perfil do vendedor
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Perfil de vendedor não encontrado' },
        { status: 404 }
      );
    }

    // Buscar produtos do vendedor (usando User.id, não SellerProfile.id)
    const products = await prisma.product.findMany({
      where: {
        sellerId: session.user.id, // Product.sellerId aponta para User.id
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        variations: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('[Seller Products API] Produtos encontrados:', products.length);

    // Converter Decimal para Number
    const productsWithNumbers = products.map((product) => {
      const priceAsNumber = Number(product.price);

      console.log('[Seller Products API] Produto:', product.name);
      console.log('[Seller Products API] Price - Original:', product.price, 'Type:', typeof product.price);
      console.log('[Seller Products API] Price - Converted:', priceAsNumber, 'Type:', typeof priceAsNumber);

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: priceAsNumber,
        categoryId: product.categoryId,
        sellerId: product.sellerId,
        images: product.images,
        condition: product.condition,
        stock: product.stock,
        status: product.status,
        category: product.category,
        variations: product.variations,
        _count: product._count,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return NextResponse.json(productsWithNumbers);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

// POST /api/seller/products - Criar novo produto
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente vendedores.' },
        { status: 403 }
      );
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Perfil de vendedor não encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      categoryId,
      images,
      condition,
      stock,
      status,
      variations,
    } = body;

    // Validações básicas
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Gerar slug a partir do nome
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();

    // Criar produto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        sellerId: session.user.id, // sellerId aponta para User, não SellerProfile
        images: images || [],
        condition: condition || 'NEW',
        stock: parseInt(stock) || 0,
        status: status || 'DRAFT',
        variations: variations
          ? {
              create: variations.map((v: any) => ({
                name: v.name,
                value: v.value,
                priceAdjustment: parseFloat(v.priceAdjustment) || 0,
                stock: parseInt(v.stock) || 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        variations: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
