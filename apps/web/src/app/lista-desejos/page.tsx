'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { Heart } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/lista-desejos');
    } else if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setWishlistItems(data);
    } catch (error) {
      console.error('Erro ao buscar wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Minha Lista de Desejos</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length === 0
                ? 'Você ainda não adicionou produtos à sua lista de desejos'
                : `${wishlistItems.length} ${wishlistItems.length === 1 ? 'produto' : 'produtos'} na sua lista`}
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-12">
              <Heart className="h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">
                Sua lista de desejos está vazia
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore nossa loja e adicione produtos que você ama!
              </p>
              <Button asChild className="mt-6">
                <Link href="/produtos">Explorar Produtos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => (
                <ProductCard
                  key={item.product.id}
                  product={{
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    imageUrl: item.product.images?.[0] || null,
                    condition: item.product.condition,
                    category: item.product.category,
                    seller: item.product.seller,
                    _count: item.product._count,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
