'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  Eye,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';

interface Analytics {
  overview: {
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    availablePayout: number;
    processedPayout: number;
    rating: number | null;
  };
  salesByStatus: {
    CONFIRMED: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
  };
  topProducts: Array<{
    productId: string;
    name: string;
    imageUrl: string | null;
    totalSold: number;
    totalRevenue: number;
    orderCount: number;
  }>;
  salesChart: Array<{
    date: string;
    revenue: number;
    count: number;
  }>;
}

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/dashboard/vendedor');
    } else if (status === 'authenticated') {
      if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
        router.push('/');
      } else {
        fetchAnalytics();
      }
    }
  }, [status, session, router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/seller/analytics');
      if (!response.ok) {
        throw new Error('Erro ao buscar analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const stats = [
    {
      label: 'Produtos Ativos',
      value: analytics.overview.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total de Vendas',
      value: analytics.overview.totalSales,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Receita Total',
      value: `R$ ${analytics.overview.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Disponível para Saque',
      value: `R$ ${analytics.overview.availablePayout.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard do Vendedor</h1>
              <p className="text-muted-foreground">
                Gerencie seus produtos e vendas
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/vendedor/produtos/novo">
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rating */}
          {analytics.overview.rating !== null && analytics.overview.rating > 0 && (
            <div className="mt-6 rounded-lg border bg-white p-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">
                    {Number(analytics.overview.rating).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avaliação Média
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Top Products */}
            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Produtos Mais Vendidos</h2>
                <Link
                  href="/dashboard/vendedor/produtos"
                  className="text-sm text-primary hover:underline"
                >
                  Ver todos
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {analytics.topProducts.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Nenhuma venda ainda
                  </p>
                ) : (
                  analytics.topProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.totalSold} vendidos • {product.orderCount}{' '}
                          pedidos
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        R$ {product.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sales by Status */}
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-xl font-bold">Vendas por Status</h2>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Confirmados</span>
                  </div>
                  <span className="font-bold">
                    {analytics.salesByStatus.CONFIRMED}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Processando</span>
                  </div>
                  <span className="font-bold">
                    {analytics.salesByStatus.PROCESSING}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm">Enviados</span>
                  </div>
                  <span className="font-bold">
                    {analytics.salesByStatus.SHIPPED}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Entregues</span>
                  </div>
                  <span className="font-bold">
                    {analytics.salesByStatus.DELIVERED}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/dashboard/vendedor/produtos"
              className="group overflow-hidden rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Package className="h-8 w-8 text-primary" />
                  <h3 className="mt-3 font-bold">Meus Produtos</h3>
                  <p className="text-sm text-muted-foreground">
                    Gerencie seus produtos
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/dashboard/vendedor/pedidos"
              className="group overflow-hidden rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  <h3 className="mt-3 font-bold">Pedidos Recebidos</h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe seus pedidos
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/dashboard/vendedor/payouts"
              className="group overflow-hidden rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <DollarSign className="h-8 w-8 text-primary" />
                  <h3 className="mt-3 font-bold">Pagamentos</h3>
                  <p className="text-sm text-muted-foreground">
                    Histórico de pagamentos
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
