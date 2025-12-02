'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';

interface SalesReport {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    platformFees: number;
  };
  timeline: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ id: string; name: string; quantity: number; revenue: number }>;
  topSellers: Array<{ sellerId: string; name: string; orders: number; revenue: number }>;
}

interface UsersReport {
  summary: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
  };
  growth: Array<{ date: string; count: number }>;
}

interface CoursesReport {
  summary: {
    totalCourses: number;
    totalEnrollments: number;
    enrollmentsInPeriod: number;
    avgRating: number;
    revenue: number;
    byType: Record<string, number>;
    byLevel: Record<string, number>;
  };
  topCoursesByEnrollments: Array<{
    id: string;
    title: string;
    enrollments: number;
    revenue: number;
    avgRating: number;
  }>;
  topInstructors: Array<{
    id: string;
    name: string;
    courses: number;
    enrollments: number;
    revenue: number;
  }>;
}

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(true);

  // Reports data
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [usersReport, setUsersReport] = useState<UsersReport | null>(null);
  const [coursesReport, setCoursesReport] = useState<CoursesReport | null>(null);

  // Verificar autenticação e role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/admin/reports');
      return;
    }

    if (status === 'authenticated') {
      const roles = session.user.roles || [];
      if (!roles.includes('ADMIN')) {
        router.push('/');
        return;
      }
      fetchReports();
    }
  }, [status, session, router]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [salesRes, usersRes, coursesRes] = await Promise.all([
        fetch('/api/admin/reports/sales'),
        fetch('/api/admin/reports/users'),
        fetch('/api/admin/reports/courses'),
      ]);

      if (!salesRes.ok || !usersRes.ok || !coursesRes.ok) {
        throw new Error('Erro ao buscar relatórios');
      }

      const [sales, users, courses] = await Promise.all([
        salesRes.json(),
        usersRes.json(),
        coursesRes.json(),
      ]);

      setSalesReport(sales);
      setUsersReport(users);
      setCoursesReport(courses);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      toast.error('Erro ao buscar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (status === 'loading' || !session || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <p className="text-muted-foreground">Carregando relatórios...</p>
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground mt-2">
              Visualize dados e estatísticas da plataforma
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="mb-8">
              <Tabs.Trigger value="sales">Vendas</Tabs.Trigger>
              <Tabs.Trigger value="users">Usuários</Tabs.Trigger>
              <Tabs.Trigger value="courses">Cursos</Tabs.Trigger>
            </Tabs.List>

            {/* Tab: Vendas */}
            <Tabs.Content value="sales">
              {salesReport && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Total de Pedidos
                          </p>
                          <p className="text-2xl font-bold">
                            {salesReport.summary.totalOrders}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Receita Total
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(salesReport.summary.totalRevenue)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Ticket Médio
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(salesReport.summary.avgOrderValue)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Taxas da Plataforma
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(salesReport.summary.platformFees)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-orange-600" />
                      </div>
                    </Card>
                  </div>

                  {/* Timeline Chart */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Receita ao Longo do Tempo</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesReport.timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          name="Receita"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Top Products */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Top 10 Produtos</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Produto</th>
                            <th className="text-right py-2">Quantidade</th>
                            <th className="text-right py-2">Receita</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesReport.topProducts.map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="py-2">{product.name}</td>
                              <td className="text-right">{product.quantity}</td>
                              <td className="text-right">
                                {formatCurrency(product.revenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Top Sellers */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Top 10 Vendedores</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Vendedor</th>
                            <th className="text-right py-2">Pedidos</th>
                            <th className="text-right py-2">Receita</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesReport.topSellers.map((seller) => (
                            <tr key={seller.sellerId} className="border-b">
                              <td className="py-2">{seller.name}</td>
                              <td className="text-right">{seller.orders}</td>
                              <td className="text-right">
                                {formatCurrency(seller.revenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
            </Tabs.Content>

            {/* Tab: Usuários */}
            <Tabs.Content value="users">
              {usersReport && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Total de Usuários
                          </p>
                          <p className="text-2xl font-bold">
                            {usersReport.summary.totalUsers}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Novos Usuários (30d)
                          </p>
                          <p className="text-2xl font-bold">
                            {usersReport.summary.newUsers}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Usuários Ativos (30d)
                          </p>
                          <p className="text-2xl font-bold">
                            {usersReport.summary.activeUsers}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Administradores
                          </p>
                          <p className="text-2xl font-bold">
                            {usersReport.summary.byRole.ADMIN || 0}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-orange-600" />
                      </div>
                    </Card>
                  </div>

                  {/* Growth Chart */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Crescimento de Usuários</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={usersReport.growth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" name="Novos Usuários" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Users by Role */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Usuários por Role</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={Object.entries(usersReport.summary.byRole).map(([key, value]) => ({
                              name: key,
                              value,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.keys(usersReport.summary.byRole).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Usuários por Status</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={Object.entries(usersReport.summary.byStatus).map(([key, value]) => ({
                              name: key,
                              value,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.keys(usersReport.summary.byStatus).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                </div>
              )}
            </Tabs.Content>

            {/* Tab: Cursos */}
            <Tabs.Content value="courses">
              {coursesReport && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Total de Cursos
                          </p>
                          <p className="text-2xl font-bold">
                            {coursesReport.summary.totalCourses}
                          </p>
                        </div>
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Total Matrículas
                          </p>
                          <p className="text-2xl font-bold">
                            {coursesReport.summary.totalEnrollments}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Novas Matrículas (30d)
                          </p>
                          <p className="text-2xl font-bold">
                            {coursesReport.summary.enrollmentsInPeriod}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Rating Médio
                          </p>
                          <p className="text-2xl font-bold">
                            {coursesReport.summary.avgRating.toFixed(1)} ⭐
                          </p>
                        </div>
                        <BookOpen className="h-8 w-8 text-orange-600" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Receita Total
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(coursesReport.summary.revenue)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </Card>
                  </div>

                  {/* Top Courses */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Top 10 Cursos (por Matrículas)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Curso</th>
                            <th className="text-right py-2">Matrículas</th>
                            <th className="text-right py-2">Receita</th>
                            <th className="text-right py-2">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coursesReport.topCoursesByEnrollments.map((course) => (
                            <tr key={course.id} className="border-b">
                              <td className="py-2">{course.title}</td>
                              <td className="text-right">{course.enrollments}</td>
                              <td className="text-right">
                                {formatCurrency(course.revenue)}
                              </td>
                              <td className="text-right">
                                {course.avgRating.toFixed(1)} ⭐
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Top Instructors */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Top 10 Instrutores</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Instrutor</th>
                            <th className="text-right py-2">Cursos</th>
                            <th className="text-right py-2">Matrículas</th>
                            <th className="text-right py-2">Receita</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coursesReport.topInstructors.map((instructor) => (
                            <tr key={instructor.id} className="border-b">
                              <td className="py-2">{instructor.name}</td>
                              <td className="text-right">{instructor.courses}</td>
                              <td className="text-right">{instructor.enrollments}</td>
                              <td className="text-right">
                                {formatCurrency(instructor.revenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Courses by Type and Level */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Cursos por Tipo</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={Object.entries(coursesReport.summary.byType).map(([key, value]) => ({
                              name: key,
                              value,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.keys(coursesReport.summary.byType).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Cursos por Nível</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={Object.entries(coursesReport.summary.byLevel).map(([key, value]) => ({
                              name: key,
                              value,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.keys(coursesReport.summary.byLevel).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                </div>
              )}
            </Tabs.Content>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
