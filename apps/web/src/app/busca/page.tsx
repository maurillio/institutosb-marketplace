'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { Card } from '@thebeautypro/ui/card';
import {
  Search,
  ShoppingBag,
  GraduationCap,
  Star,
  Clock,
  Users,
  Filter,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { name: string; slug: string };
  seller: {
    name: string;
    sellerProfile: { businessName: string; rating: number | null } | null;
  };
  _count: { reviews: number; orderItems: number };
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number | null;
  thumbnailUrl: string | null;
  type: string;
  level: string;
  duration: number | null;
  instructor: {
    name: string;
    instructorProfile: { rating: number | null } | null;
  };
  _count: { enrollments: number; reviews: number };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProducts: 0, totalCourses: 0 });
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'courses'>(
    typeParam === 'products' || typeParam === 'courses' ? (typeParam as any) : 'all'
  );

  useEffect(() => {
    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query, activeTab]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const type = activeTab === 'all' ? '' : activeTab;
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar');
      }

      const data = await response.json();
      setProducts(data.products || []);
      setCourses(data.courses || []);
      setStats(data.stats || { totalProducts: 0, totalCourses: 0 });
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleTabChange = (tab: 'all' | 'products' | 'courses') => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', tab);
    router.push(`/busca?${params.toString()}`);
  };

  if (!query) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Buscar na The Beauty Pro</h2>
            <p className="text-gray-600 mt-2">
              Digite algo na barra de pesquisa para começar
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header de Busca */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Resultados para "{query}"</h1>
            {!loading && (
              <p className="text-muted-foreground mt-2">
                {stats.totalProducts + stats.totalCourses} resultados encontrados (
                {stats.totalProducts} produtos, {stats.totalCourses} cursos)
              </p>
            )}
          </div>

          {/* Tabs de Filtro */}
          <div className="mb-6 border-b">
            <div className="flex space-x-8">
              <button
                onClick={() => handleTabChange('all')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Todos ({stats.totalProducts + stats.totalCourses})
              </button>
              <button
                onClick={() => handleTabChange('products')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'products'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Produtos ({stats.totalProducts})
              </button>
              <button
                onClick={() => handleTabChange('courses')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'courses'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Cursos ({stats.totalCourses})
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Buscando...</p>
            </div>
          )}

          {/* Sem Resultados */}
          {!loading && products.length === 0 && courses.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold">Nenhum resultado encontrado</h2>
              <p className="text-muted-foreground mt-2">
                Tente buscar com outros termos ou explore nossas categorias
              </p>
              <div className="mt-6 flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/produtos">Ver Todos os Produtos</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/cursos">Ver Todos os Cursos</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Resultados */}
          {!loading && (products.length > 0 || courses.length > 0) && (
            <div className="space-y-8">
              {/* Produtos */}
              {(activeTab === 'all' || activeTab === 'products') && products.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Produtos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <Link key={product.id} href={`/produtos/${product.id}`}>
                        <Card className="hover:shadow-lg transition-shadow h-full">
                          <div className="relative aspect-square">
                            <Image
                              src={product.imageUrl || '/placeholder.png'}
                              alt={product.name}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">
                              {product.category.name}
                            </p>
                            <h3 className="font-semibold line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center mb-2">
                              {product.seller.sellerProfile?.rating && (
                                <div className="flex items-center text-sm text-yellow-600">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="ml-1">
                                    {product.seller.sellerProfile.rating.toFixed(1)}
                                  </span>
                                  <span className="text-muted-foreground ml-1">
                                    ({product._count.reviews})
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(product.price)}
                              </span>
                              {product._count.orderItems > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {product._count.orderItems} vendas
                                </span>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Cursos */}
              {(activeTab === 'all' || activeTab === 'courses') && courses.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Cursos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Link key={course.id} href={`/cursos/${course.id}`}>
                        <Card className="hover:shadow-lg transition-shadow h-full">
                          <div className="relative aspect-video">
                            <Image
                              src={course.thumbnailUrl || '/placeholder.png'}
                              alt={course.title}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold">
                              {course.type === 'ONLINE' ? '🌐 Online' : '📍 Presencial'}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold line-clamp-2 mb-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {course.description}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{course._count.enrollments} alunos</span>
                              {course.duration && (
                                <>
                                  <Clock className="h-4 w-4 ml-3 mr-1" />
                                  <span>{course.duration}h</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-primary">
                                {course.price ? formatPrice(course.price) : 'Grátis'}
                              </span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {course.level}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center bg-gray-50">
            <p>Carregando...</p>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
