import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// Forçar rota dinâmica (necessário para request.url)
export const dynamic = 'force-dynamic';

// GET /api/products - Listar produtos com filtros e paginação
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de filtro
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const categoryId = searchParams.get('categoryId');
    const condition = searchParams.get('condition'); // NEW ou USED
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const inStock = searchParams.get('inStock') === 'true';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Filtros específicos de beleza
    const brand = searchParams.get('brand');
    const skinType = searchParams.get('skinType');
    const concern = searchParams.get('concern');
    const tag = searchParams.get('tag');

    // Construir objeto de filtros
    const where: any = {
      status: 'ACTIVE', // Apenas produtos ativos
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    // Filtros de beleza
    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (skinType) {
      where.skinTypes = { has: skinType };
    }

    if (concern) {
      where.concerns = { has: concern };
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar produtos com paginação
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
              sellerProfile: {
                select: {
                  rating: true,
                  storeName: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Converter Decimal para number e ajustar estrutura
    const productsWithNumbers = products.map((product) => {
      const priceAsNumber = Number(product.price);
      const productRating = Number(product.rating);
      const ratingAsNumber = product.seller.sellerProfile?.rating
        ? Number(product.seller.sellerProfile.rating)
        : null;

      // Debug: verificar tipos
      console.log('[API Products] Product:', product.name);
      console.log('[API Products] Price - Original:', product.price, 'Type:', typeof product.price);
      console.log('[API Products] Price - Converted:', priceAsNumber, 'Type:', typeof priceAsNumber);

      return {
        id: product.id,
        name: product.name,
        price: priceAsNumber,
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
        condition: product.condition,
        stock: product.stock,
        status: product.status,
        rating: productRating,
        sales: product.sales,
        category: product.category,
        seller: {
          user: {
            name: product.seller.name,
          },
          rating: ratingAsNumber,
        },
        _count: product._count,
      };
    });

    return NextResponse.json({
      products: productsWithNumbers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
