'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Download, TrendingUp, Users, Award, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  enrollmentId: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  lastAccessedAt: string | null;
  status: 'completed' | 'in_progress' | 'not_started';
}

interface Stats {
  totalStudents: number;
  completedStudents: number;
  inProgressStudents: number;
  notStartedStudents: number;
  averageProgress: number;
}

interface CourseData {
  id: string;
  title: string;
}

export default function CourseStudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/dashboard/instrutor/cursos/' + params.id + '/alunos');
    } else if (status === 'authenticated') {
      fetchStudents();
      fetchCourse();
    }
  }, [status, params.id, router, page, statusFilter, searchTerm]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/instructor/courses/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCourse({ id: data.id, title: data.title });
      }
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter) queryParams.append('status', statusFilter);
      if (searchTerm) queryParams.append('search', searchTerm);

      const response = await fetch(
        `/api/instructor/courses/${params.id}/students?${queryParams}`
      );

      if (!response.ok) {
        if (response.status === 403) {
          toast.error('Você não é o instrutor deste curso');
          router.push('/dashboard/instrutor');
          return;
        }
        throw new Error('Erro ao buscar alunos');
      }

      const data = await response.json();
      setStudents(data.students);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast.error('Erro ao buscar alunos');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (students.length === 0) {
      toast.error('Nenhum aluno para exportar');
      return;
    }

    const headers = ['Nome', 'Email', 'Progresso (%)', 'Status', 'Data de Matrícula', 'Último Acesso'];
    const rows = students.map((s) => [
      s.student.name || '',
      s.student.email || '',
      s.progress.toString(),
      s.status === 'completed'
        ? 'Concluído'
        : s.status === 'in_progress'
        ? 'Em Progresso'
        : 'Não Iniciado',
      new Date(s.enrolledAt).toLocaleDateString('pt-BR'),
      s.lastAccessedAt ? new Date(s.lastAccessedAt).toLocaleDateString('pt-BR') : 'Nunca',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alunos-${course?.title || 'curso'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Lista exportada com sucesso!');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      not_started: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      completed: 'Concluído',
      in_progress: 'Em Progresso',
      not_started: 'Não Iniciado',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
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
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/instrutor" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href={`/dashboard/instrutor/cursos/${params.id}/editar`}
              className="hover:text-foreground"
            >
              {course?.title || 'Curso'}
            </Link>
            <span>/</span>
            <span className="text-foreground">Alunos</span>
          </nav>

          {/* Cabeçalho */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Alunos do Curso</h1>
              <p className="text-muted-foreground">{course?.title}</p>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Estatísticas */}
          {stats && (
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Alunos</p>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Concluíram</p>
                    <p className="text-2xl font-bold">{stats.completedStudents}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Em Progresso</p>
                    <p className="text-2xl font-bold">{stats.inProgressStudents}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 p-3">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso Médio</p>
                    <p className="text-2xl font-bold">{Math.round(stats.averageProgress)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-md border border-input bg-white px-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Filtro de Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Todos os Status</option>
              <option value="completed">Concluídos</option>
              <option value="in_progress">Em Progresso</option>
              <option value="not_started">Não Iniciados</option>
            </select>
          </div>

          {/* Tabela de Alunos */}
          <div className="rounded-lg border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Data de Matrícula
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Último Acesso
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        Nenhum aluno encontrado
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.enrollmentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                              {student.student.avatar ? (
                                <Image
                                  src={student.student.avatar}
                                  alt={student.student.name || ''}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600">
                                  {student.student.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{student.student.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(student.status)}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(student.enrolledAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {student.lastAccessedAt
                            ? new Date(student.lastAccessedAt).toLocaleDateString('pt-BR')
                            : 'Nunca'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    onClick={() => setPage(pageNum)}
                    size="icon"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
