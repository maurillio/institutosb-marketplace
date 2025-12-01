import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// GET /api/products/[id] - Buscar detalhes de um produto específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
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
                totalSales: true,
                storeName: true,
              },
            },
          },
        },
        variations: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Últimas 10 avaliações
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Calcular média de avaliações
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    // Converter Decimal para Number
    const productWithNumbers = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      images: product.images,
      condition: product.condition,
      stock: product.stock,
      status: product.status,
      category: product.category,
      seller: {
        ...product.seller,
        sellerProfile: product.seller.sellerProfile ? {
          ...product.seller.sellerProfile,
          rating: product.seller.sellerProfile.rating ? Number(product.seller.sellerProfile.rating) : null,
        } : null,
      },
      variations: product.variations,
      reviews: product.reviews,
      _count: product._count,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      avgRating: parseFloat(avgRating.toFixed(1)),
    };

    return NextResponse.json(productWithNumbers);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}
