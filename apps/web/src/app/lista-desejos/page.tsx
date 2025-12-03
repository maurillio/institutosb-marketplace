'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { Card } from '@thebeautypro/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
    compareAtPrice: number | null;
    stock: number;
    status: string;
    rating: number | null;
    seller: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
    };
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

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
      if (!response.ok) throw new Error('Erro ao buscar lista de desejos');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar lista de desejos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setRemovingIds((prev) => new Set(prev).add(productId));

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao remover produto');

      toast.success('Produto removido da lista de desejos');
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao remover produto');
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const calculateDiscount = (price: number, compareAt: number | null) => {
    if (!compareAt || compareAt <= price) return null;
    return Math.round(((compareAt - price) / compareAt) * 100);
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

  const wishlistCount = wishlist.length;
  const wishlistText = wishlistCount > 0
    ? `${wishlistCount} ${wishlistCount === 1 ? 'produto salvo' : 'produtos salvos'}`
    : 'Nenhum produto salvo';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Minha Lista de Desejos</h1>
          <p className="text-muted-foreground">{wishlistText}</p>

          {wishlist.length === 0 ? (
            <Card className="mt-12 p-12 text-center">
              <Heart className="mx-auto h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">
                Sua lista de desejos está vazia
              </h2>
              <p className="mt-2 text-muted-foreground">
                Adicione produtos que você gostou para não perdê-los de vista
              </p>
              <Button asChild className="mt-6">
                <Link href="/produtos">Explorar Produtos</Link>
              </Button>
            </Card>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((item) => {
                const discount = calculateDiscount(
                  item.product.price,
                  item.product.compareAtPrice
                );
                const isRemoving = removingIds.has(item.productId);
                const isOutOfStock = item.product.stock === 0;
                const isInactive = item.product.status !== 'ACTIVE';

                return (
                  <Card
                    key={item.id}
                    className="group overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    <Link href={`/produtos/${item.product.id}`}>
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={
                            item.product.images[0] ||
                            'https://via.placeholder.com/400'
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {discount && (
                          <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                            -{discount}%
                          </div>
                        )}
                        {(isOutOfStock || isInactive) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-white px-4 py-2 font-semibold text-gray-900">
                              {isInactive ? 'Indisponível' : 'Sem Estoque'}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link href={`/produtos/${item.product.id}`}>
                        <p className="text-xs text-muted-foreground">
                          {item.product.category.name}
                        </p>
                        <h3 className="mt-1 font-bold line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          por {item.product.seller.name}
                        </p>

                        {item.product.rating && (
                          <div className="mt-2 flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {item.product.rating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        <div className="mt-3">
                          {item.product.compareAtPrice &&
                            item.product.compareAtPrice > item.product.price && (
                              <p className="text-sm text-muted-foreground line-through">
                                R$ {item.product.compareAtPrice.toFixed(2)}
                              </p>
                            )}
                          <p className="text-2xl font-bold text-primary">
                            R$ {item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </Link>

                      <div className="mt-4 flex gap-2">
                        <Button
                          asChild
                          className="flex-1"
                          disabled={isOutOfStock || isInactive}
                        >
                          <Link href={`/produtos/${item.product.id}`}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Ver Produto
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemove(item.productId)}
                          disabled={isRemoving}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          {isRemoving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
