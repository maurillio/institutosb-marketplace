import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// GET /api/products/[id]/related - Buscar produtos relacionados
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Buscar produto atual para obter dados de relacionamento
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        categoryId: true,
        tags: true,
        brand: true,
        concerns: true,
        skinTypes: true,
        price: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Critérios de busca para produtos relacionados:
    // 1. Mesma categoria (peso maior)
    // 2. Tags em comum
    // 3. Mesma marca
    // 4. Concerns em comum
    // 5. Faixa de preço similar (±30%)

    const priceMin = Number(product.price) * 0.7;
    const priceMax = Number(product.price) * 1.3;

    // Buscar produtos relacionados
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: id }, // Excluir o produto atual
        status: 'ACTIVE',
        OR: [
          // Mesma categoria
          { categoryId: product.categoryId },
          // Tags em comum
          ...(product.tags.length > 0
            ? [{ tags: { hasSome: product.tags } }]
            : []),
          // Mesma marca
          ...(product.brand ? [{ brand: product.brand }] : []),
          // Concerns em comum
          ...(product.concerns.length > 0
            ? [{ concerns: { hasSome: product.concerns } }]
            : []),
        ],
        // Faixa de preço similar
        price: {
          gte: priceMin,
          lte: priceMax,
        },
      },
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
      take: 8, // Limitar a 8 produtos relacionados
      orderBy: [
        { sales: 'desc' }, // Priorizar produtos mais vendidos
        { rating: 'desc' }, // Depois por avaliação
      ],
    });

    // Converter Decimal para number
    const productsWithNumbers = relatedProducts.map((prod) => ({
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      price: Number(prod.price),
      imageUrl: prod.images && prod.images.length > 0 ? prod.images[0] : null,
      images: prod.images,
      condition: prod.condition,
      stock: prod.stock,
      rating: Number(prod.rating),
      sales: prod.sales,
      category: prod.category,
      seller: {
        user: {
          name: prod.seller.name,
        },
        rating: prod.seller.sellerProfile?.rating
          ? Number(prod.seller.sellerProfile.rating)
          : null,
        storeName: prod.seller.sellerProfile?.storeName || prod.seller.name,
      },
      _count: prod._count,
    }));

    return NextResponse.json({
      products: productsWithNumbers,
      total: productsWithNumbers.length,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos relacionados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos relacionados' },
      { status: 500 }
    );
  }
}
