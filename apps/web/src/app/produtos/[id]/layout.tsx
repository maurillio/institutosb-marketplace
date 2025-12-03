import { Metadata } from 'next';
import { prisma } from '@thebeautypro/database';
import { generateProductMetadata } from '@/lib/seo/metadata';
import { generateProductSchema } from '@/lib/seo/jsonld';
import { JsonLdScript } from '@/components/seo/jsonld-script';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        name: true,
        description: true,
        price: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
        seller: {
          select: {
            name: true,
          },
        },
        avgRating: true,
        _count: {
          select: {
            reviews: true,
          },
        },
        stock: true,
      },
    });

    if (!product) {
      return {
        title: 'Produto não encontrado',
      };
    }

    return generateProductMetadata({
      name: product.name,
      description: product.description || 'Produto disponível na The Beauty Pro',
      price: Number(product.price),
      images: product.images,
      category: product.category.name,
      seller: product.seller.name,
      rating: product.avgRating ? Number(product.avgRating) : undefined,
      reviewCount: product._count.reviews,
      inStock: product.stock > 0,
    });
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Produto',
    };
  }
}

export default async function ProductLayout({ params, children }: Props) {
  let jsonLd = null;

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        avgRating: true,
        _count: {
          select: {
            reviews: true,
          },
        },
        stock: true,
      },
    });

    if (product) {
      jsonLd = generateProductSchema({
        id: product.id,
        name: product.name,
        description: product.description || 'Produto disponível na The Beauty Pro',
        price: Number(product.price),
        images: product.images,
        category: product.category.name,
        seller: product.seller,
        rating: product.avgRating ? Number(product.avgRating) : undefined,
        reviewCount: product._count.reviews,
        inStock: product.stock > 0,
      });
    }
  } catch (error) {
    console.error('Error generating product JSON-LD:', error);
  }

  return (
    <>
      {jsonLd && <JsonLdScript data={jsonLd} />}
      {children}
    </>
  );
}
