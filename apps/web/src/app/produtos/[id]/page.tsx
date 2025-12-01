'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { useCart } from '@/contexts/cart-context';
import {
  Heart,
  Share2,
  Star,
  ShoppingCart,
  MapPin,
  Shield,
  Package,
  ChevronLeft,
} from 'lucide-react';

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  images: string[];
  condition: string;
  stock: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    name: string;
    avatar: string | null;
    sellerProfile: {
      rating: number | null;
      totalSales: number;
      storeName: string | null;
    } | null;
  };
  variations: Array<{
    id: string;
    name: string;
    value: string;
    priceAdjustment: number;
    stock: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      name: string;
      avatar: string | null;
    };
  }>;
  avgRating: number;
  _count: {
    reviews: number;
  };
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      router.push('/produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const selectedVar = product.variations.find(v => v.id === selectedVariation);

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price + (selectedVar?.priceAdjustment || 0),
      imageUrl: product.imageUrl,
      quantity,
      stock: selectedVar?.stock || product.stock,
      variationId: selectedVariation || undefined,
      variationName: selectedVar ? `${selectedVar.name}: ${selectedVar.value}` : undefined,
    });

    // Feedback visual (opcional)
    alert('Produto adicionado ao carrinho!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Carregando produto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images.length > 0 ? product.images : [product.imageUrl || 'https://via.placeholder.com/600'];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/produtos" className="hover:text-primary">
              Produtos
            </Link>
            <span>/</span>
            <Link href={`/produtos?categoryId=${product.category.id}`} className="hover:text-primary">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Galeria de imagens */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                />

                {/* Badge de condição */}
                <div className="absolute left-4 top-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      product.condition === 'NEW'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {product.condition === 'NEW' ? 'Novo' : 'Usado'}
                  </span>
                </div>
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do produto */}
            <div>
              <div className="rounded-lg bg-white p-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>

                {/* Avaliações */}
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= product.avgRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.avgRating.toFixed(1)} ({product._count.reviews} avaliações)
                  </span>
                </div>

                {/* Preço */}
                <div className="mt-6">
                  <p className="text-4xl font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>

                {/* Estoque */}
                <div className="mt-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {product.stock > 0 ? (
                      <span className="text-green-600">
                        {product.stock} unidades disponíveis
                      </span>
                    ) : (
                      <span className="text-red-600">Fora de estoque</span>
                    )}
                  </span>
                </div>

                {/* Variações */}
                {product.variations.length > 0 && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium">
                      Selecione uma variação:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variations.map((variation) => (
                        <button
                          key={variation.id}
                          onClick={() => setSelectedVariation(variation.id)}
                          disabled={variation.stock === 0}
                          className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                            selectedVariation === variation.id
                              ? 'border-primary bg-primary text-white'
                              : variation.stock === 0
                              ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          {variation.value}
                          {variation.priceAdjustment !== 0 && (
                            <span className="ml-2">
                              +R$ {variation.priceAdjustment.toFixed(2)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantidade */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium">
                    Quantidade:
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="mt-8 flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Adicionar ao carrinho
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Informações do vendedor */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-semibold">Vendido por</h3>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                      {product.seller.avatar && (
                        <Image
                          src={product.seller.avatar}
                          alt={product.seller.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.seller.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {product.seller.sellerProfile?.rating?.toFixed(1) || '0.0'} •{' '}
                          {product.seller.sellerProfile?.totalSales || 0} vendas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Garantias */}
              <div className="mt-6 rounded-lg bg-white p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Compra Protegida</p>
                      <p className="text-sm text-muted-foreground">
                        Seu dinheiro está seguro com a garantia The Beauty Pro
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Envio Seguro</p>
                      <p className="text-sm text-muted-foreground">
                        Rastreamento disponível para todos os pedidos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição e avaliações */}
          <div className="mt-8 rounded-lg bg-white p-6">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-8">
                <button className="border-b-2 border-primary pb-3 font-medium">
                  Descrição
                </button>
                <button className="pb-3 text-muted-foreground hover:text-foreground">
                  Avaliações ({product._count.reviews})
                </button>
              </div>
            </div>

            {/* Conteúdo da descrição */}
            <div className="mt-6">
              <p className="whitespace-pre-line text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>

          {/* Avaliações */}
          {product.reviews.length > 0 && (
            <div className="mt-8 rounded-lg bg-white p-6">
              <h2 className="text-xl font-bold">Avaliações dos clientes</h2>
              <div className="mt-6 space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                          {review.user.avatar && (
                            <Image
                              src={review.user.avatar}
                              alt={review.user.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{review.user.name}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
