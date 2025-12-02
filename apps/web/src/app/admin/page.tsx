'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShoppingBag,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Settings,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCourses: number;
  totalSales: number;
  totalRevenue: number;
}

interface SalesData {
  timeline: Array<{ date: string; revenue: number; orders: number }>;
}

interface Activity {
  id: string;
  type: 'order' | 'user' | 'product' | 'course';
  title: string;
  description: string;
  timestamp: Date;
  icon: any;
  color: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/entrar');
      return;
    }

    // Verificar se o usuário tem role ADMIN
    const roles = session.user.roles || [];
    if (!roles.includes('ADMIN')) {
      router.push('/dashboard');
      return;
    }

    // Carregar dados
    loadDashboardData();
  }, [session, status, router]);

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas e dados de vendas em paralelo
      const [statsRes, salesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/reports/sales'),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      if (salesRes.ok) {
        const data = await salesRes.json();
        setSalesData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atividades recentes simuladas (em produção, viria de uma API)
  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'order',
      title: 'Novo Pedido',
      description: 'Pedido #1234 - R$ 299,90',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: ShoppingBag,
      color: 'text-green-600',
    },
    {
      id: '2',
      type: 'user',
      title: 'Novo Usuário',
      description: 'Maria Silva se cadastrou',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      id: '3',
      type: 'product',
      title: 'Produto Aprovado',
      description: 'Kit Maquiagem Premium foi aprovado',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: '4',
      type: 'course',
      title: 'Novo Curso',
      description: 'Maquiagem para Iniciantes foi publicado',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      icon: GraduationCap,
      color: 'text-purple-600',
    },
    {
      id: '5',
      type: 'product',
      title: 'Produto Pendente',
      description: 'Base Facial HD aguarda aprovação',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      icon: AlertCircle,
      color: 'text-orange-600',
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'agora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo, {session?.user?.name}
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Usuários cadastrados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Produtos
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalProducts || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Produtos cadastrados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Cursos
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalCourses || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cursos publicados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {((stats?.totalRevenue || 0) / 100).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vendas totais
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Gráfico de Vendas */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Receita dos Últimos 30 Dias</CardTitle>
                <CardDescription>
                  Vendas e receita ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesData?.timeline && salesData.timeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={salesData.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          // Exibir apenas últimos 4 caracteres da data (MM-DD)
                          return value.slice(-5);
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Data: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Receita"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Atividades Recentes */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>
                  Últimas ações na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/users')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-blue-600" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">Usuários</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Gerenciar usuários
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/products')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">Produtos</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Aprovar e gerenciar
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/courses')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <GraduationCap className="h-8 w-8 text-purple-600" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">Cursos</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Aprovar e gerenciar
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/reports')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">Relatórios</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Análises e métricas
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/settings')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Settings className="h-8 w-8 text-gray-600" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">Configurações</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Sistema e taxas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
