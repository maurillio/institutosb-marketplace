import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';
import { checkSellerProductLimit } from '@/lib/subscription/limits';

// GET /api/seller/products - Listar produtos do vendedor
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Buscar usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Se não tem role SELLER, adicionar automaticamente (qualquer um pode ser vendedor)
    if (!currentUser.roles.includes('SELLER') && !currentUser.roles.includes('ADMIN')) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          roles: [...currentUser.roles, 'SELLER'],
        },
      });
    }

    // Buscar ou criar perfil de vendedor
    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      // Criar perfil de vendedor automaticamente
      const baseSlug = currentUser.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const uniqueSlug = `${baseSlug}-${session.user.id.substring(0, 8)}`;

      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id,
          storeName: `${currentUser.name}'s Store`,
          storeSlug: uniqueSlug,
          description: 'Minha loja online de produtos de beleza',
        },
      });
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

    // Buscar usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Se não tem role SELLER, adicionar automaticamente (qualquer um pode ser vendedor)
    if (!currentUser.roles.includes('SELLER') && !currentUser.roles.includes('ADMIN')) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          roles: [...currentUser.roles, 'SELLER'],
        },
      });
    }

    // Buscar ou criar perfil de vendedor
    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      // Criar perfil de vendedor automaticamente
      const baseSlug = currentUser.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const uniqueSlug = `${baseSlug}-${session.user.id.substring(0, 8)}`;

      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id,
          storeName: `${currentUser.name}'s Store`,
          storeSlug: uniqueSlug,
          description: 'Minha loja online de produtos de beleza',
        },
      });
    }

    // Verificar limite de produtos do plano
    const limitCheck = await checkSellerProductLimit(session.user.id);
    if (!limitCheck.canCreateProduct) {
      return NextResponse.json(
        {
          error: limitCheck.reason || 'Limite de produtos atingido',
          currentCount: limitCheck.currentCount,
          maxAllowed: limitCheck.maxAllowed,
        },
        { status: 403 }
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
