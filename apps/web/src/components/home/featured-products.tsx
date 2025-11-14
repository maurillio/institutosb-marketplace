import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';
import { Star } from 'lucide-react';

// Mock data - será substituído por dados reais do banco
const products = [
  {
    id: '1',
    name: 'Shampoo Profissional 500ml',
    price: 49.9,
    image: 'https://via.placeholder.com/300x300',
    rating: 4.5,
    slug: 'shampoo-profissional-500ml',
  },
  {
    id: '2',
    name: 'Kit de Pincéis Maquiagem',
    price: 89.9,
    image: 'https://via.placeholder.com/300x300',
    rating: 5,
    slug: 'kit-pinceis-maquiagem',
  },
  {
    id: '3',
    name: 'Sérum Facial Anti-idade',
    price: 129.9,
    image: 'https://via.placeholder.com/300x300',
    rating: 4.8,
    slug: 'serum-facial-anti-idade',
  },
  {
    id: '4',
    name: 'Esmalte Gel UV 3 Semanas',
    price: 24.9,
    image: 'https://via.placeholder.com/300x300',
    rating: 4.3,
    slug: 'esmalte-gel-uv',
  },
];

export function FeaturedProducts() {
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
                    src={product.image}
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
                      {product.rating}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2)}
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
