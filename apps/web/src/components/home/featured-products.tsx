import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';
import { Star } from 'lucide-react';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { prisma } from '@thebeautypro/database';

export async function FeaturedProducts() {
  // Busca 8 produtos reais do banco - os mais bem avaliados e ativos
  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
    },
    orderBy: [
      { rating: 'desc' },
      { sales: 'desc' },
    ],
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      rating: true,
      images: true,
    },
  });
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
          <Button variant="outline" asChild>
            <Link href="/produtos">Ver todos</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produtos/${product.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0] || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    R$ {Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
