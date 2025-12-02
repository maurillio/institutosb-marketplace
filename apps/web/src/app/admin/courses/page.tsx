'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DataTable } from '@/components/admin/data-table';
import { FilterBar } from '@/components/admin/filters';
import { StatusBadge } from '@/components/admin/status-badge';
import {
  AdminCourse,
  ColumnDef,
  PaginationData,
  COURSE_STATUS_OPTIONS,
  COURSE_TYPE_OPTIONS,
  COURSE_LEVEL_OPTIONS,
} from '@/types/admin';
import { formatCurrency, formatDate } from '@/lib/format';
import { CheckCircle, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    level: '',
    search: '',
  });

  // Dialog de confirmação
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'approve' | 'archive' | 'delete';
    courseId: string;
    courseName: string;
  }>({
    open: false,
    type: 'approve',
    courseId: '',
    courseName: '',
  });

  // Verificar autenticação e role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/admin/courses');
      return;
    }

    if (status === 'authenticated') {
      const roles = session.user.roles || [];
      if (!roles.includes('ADMIN')) {
        router.push('/');
        return;
      }
      fetchCourses();
    }
  }, [status, session, router, pagination.page, filters]);

  // Buscar cursos
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/admin/courses?${params}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar cursos');
      }

      const data = await response.json();
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      toast.error('Erro ao buscar cursos');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do curso
  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar curso');
      }

      const result = await response.json();
      toast.success(result.message);
      fetchCourses();
    } catch (error: any) {
      console.error('Erro ao atualizar curso:', error);
      toast.error(error.message || 'Erro ao atualizar curso');
    }
  };

  // Deletar curso
  const handleDelete = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar curso');
      }

      toast.success('Curso deletado com sucesso');
      fetchCourses();
    } catch (error: any) {
      console.error('Erro ao deletar curso:', error);
      toast.error(error.message || 'Erro ao deletar curso');
    }
  };

  // Confirmar ação
  const handleConfirm = () => {
    const { type, courseId } = confirmDialog;

    if (type === 'approve') {
      handleStatusChange(courseId, 'PUBLISHED');
    } else if (type === 'archive') {
      handleStatusChange(courseId, 'ARCHIVED');
    } else if (type === 'delete') {
      handleDelete(courseId);
    }

    setConfirmDialog({ ...confirmDialog, open: false });
  };

  // Definir colunas da tabela
  const columns: ColumnDef<AdminCourse>[] = [
    {
      key: 'title',
      label: 'Curso',
      render: (_, course) => (
        <div className="flex items-center space-x-3">
          <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded border">
            <Image
              src={course.thumbnail || '/placeholder.png'}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{course.title}</div>
            <div className="text-sm text-muted-foreground">
              {course._count.modules} módulos
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'instructor',
      label: 'Instrutor',
      render: (_, course) => (
        <div>
          <div className="text-sm font-medium">{course.instructor.name}</div>
          {course.instructor.instructorProfile && (
            <div className="text-xs text-muted-foreground">
              ⭐ {course.instructor.instructorProfile.rating?.toFixed(1) || 'N/A'}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (_, course) => {
        const typeLabels: Record<string, string> = {
          ONLINE: 'Online',
          IN_PERSON: 'Presencial',
          HYBRID: 'Híbrido',
        };
        return (
          <div className="text-sm">{typeLabels[course.type] || course.type}</div>
        );
      },
    },
    {
      key: 'level',
      label: 'Nível',
      render: (_, course) => {
        const levelLabels: Record<string, string> = {
          BEGINNER: 'Iniciante',
          INTERMEDIATE: 'Intermediário',
          ADVANCED: 'Avançado',
        };
        return (
          <div className="text-sm">{levelLabels[course.level] || course.level}</div>
        );
      },
    },
    {
      key: 'price',
      label: 'Preço',
      render: (_, course) => (
        <div className="font-medium">{formatCurrency(course.price)}</div>
      ),
    },
    {
      key: 'enrollments',
      label: 'Matrículas',
      render: (_, course) => (
        <div className="text-sm">{course._count.enrollments}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, course) => <StatusBadge status={course.status} type="course" />,
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (_, course) => (
        <div className="text-sm">{formatDate(course.createdAt)}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, course) => (
        <div className="flex items-center gap-2">
          {course.status === 'DRAFT' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  type: 'approve',
                  courseId: course.id,
                  courseName: course.title,
                })
              }
              title="Aprovar e publicar curso"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
          )}
          {course.status === 'PUBLISHED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  type: 'archive',
                  courseId: course.id,
                  courseName: course.title,
                })
              }
              title="Arquivar curso"
            >
              <Archive className="h-4 w-4 text-orange-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setConfirmDialog({
                open: true,
                type: 'delete',
                courseId: course.id,
                courseName: course.title,
              })
            }
            title="Deletar curso"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (status === 'loading' || !session) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <p className="text-muted-foreground">Carregando...</p>
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
            <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
            <p className="text-muted-foreground mt-2">
              Aprove, arquive e gerencie todos os cursos da plataforma
            </p>
          </div>

          {/* Filtros */}
          <FilterBar
            searchValue={filters.search}
            searchPlaceholder="Buscar por título ou descrição..."
            onSearchChange={(value) => {
              setFilters({ ...filters, search: value });
              setPagination({ ...pagination, page: 1 });
            }}
            filters={[
              {
                type: 'select',
                key: 'status',
                label: 'Status',
                value: filters.status,
                options: COURSE_STATUS_OPTIONS,
                onChange: (value) => {
                  setFilters({ ...filters, status: value });
                  setPagination({ ...pagination, page: 1 });
                },
              },
              {
                type: 'select',
                key: 'type',
                label: 'Tipo',
                value: filters.type,
                options: COURSE_TYPE_OPTIONS,
                onChange: (value) => {
                  setFilters({ ...filters, type: value });
                  setPagination({ ...pagination, page: 1 });
                },
              },
              {
                type: 'select',
                key: 'level',
                label: 'Nível',
                value: filters.level,
                options: COURSE_LEVEL_OPTIONS,
                onChange: (value) => {
                  setFilters({ ...filters, level: value });
                  setPagination({ ...pagination, page: 1 });
                },
              },
            ]}
            onReset={() => {
              setFilters({ status: '', type: '', level: '', search: '' });
              setPagination({ ...pagination, page: 1 });
            }}
          />

          {/* Tabela */}
          <div className="mt-6">
            <DataTable
              columns={columns}
              data={courses}
              pagination={pagination}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              loading={loading}
              emptyMessage="Nenhum curso encontrado"
            />
          </div>
        </div>
      </main>
      <Footer />

      {/* Dialog de Confirmação */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'approve' && 'Aprovar e Publicar Curso'}
              {confirmDialog.type === 'archive' && 'Arquivar Curso'}
              {confirmDialog.type === 'delete' && 'Deletar Curso'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'approve' &&
                `Tem certeza que deseja aprovar e publicar o curso "${confirmDialog.courseName}"? Ele ficará visível na plataforma.`}
              {confirmDialog.type === 'archive' &&
                `Tem certeza que deseja arquivar o curso "${confirmDialog.courseName}"? Ele será removido da listagem pública.`}
              {confirmDialog.type === 'delete' &&
                `Tem certeza que deseja deletar o curso "${confirmDialog.courseName}"? Esta ação não pode ser desfeita e todos os módulos e aulas serão removidos.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            >
              Cancelar
            </Button>
            <Button
              variant={confirmDialog.type === 'delete' ? 'destructive' : 'default'}
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
