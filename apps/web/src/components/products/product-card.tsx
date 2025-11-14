'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    condition: string;
    stock?: number;
    category: {
      name: string;
      slug: string;
    };
    seller: {
      user: {
        name: string;
      };
      rating: number | null;
    };
    _count: {
      reviews: number;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      stock: product.stock || 999,
    });
  };

  return (
    <Link href={`/produtos/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {/* Badge de condição */}
        <div className="absolute left-2 top-2 z-10">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              product.condition === 'NEW'
                ? 'bg-green-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}
          >
            {product.condition === 'NEW' ? 'Novo' : 'Usado'}
          </span>
        </div>

        {/* Botão de favorito */}
        <button
          onClick={handleToggleFavorite}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Imagem do produto */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Informações do produto */}
        <div className="p-4">
          {/* Categoria */}
          <p className="text-xs text-muted-foreground">{product.category.name}</p>

          {/* Nome do produto */}
          <h3 className="mt-1 font-semibold line-clamp-2 group-hover:text-primary">
            {product.name}
          </h3>

          {/* Avaliações */}
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {product.seller.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-xs text-muted-foreground">
              ({product._count.reviews})
            </span>
          </div>

          {/* Vendedor */}
          <p className="mt-1 text-xs text-muted-foreground">
            Por {product.seller.user.name}
          </p>

          {/* Preço */}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            {/* Botão adicionar ao carrinho */}
            <Button
              size="icon"
              onClick={handleAddToCart}
              className="transition-transform hover:scale-110"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
