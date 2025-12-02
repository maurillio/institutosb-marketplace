'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DataTable } from '@/components/admin/data-table';
import { FilterBar } from '@/components/admin/filters';
import { StatusBadge } from '@/components/admin/status-badge';
import { Badge } from '@/components/ui/badge';
import {
  AdminUser,
  ColumnDef,
  PaginationData,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from '@/types/admin';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { MoreVertical, UserCog, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });

  // Verificar autenticação e role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/admin/users');
      return;
    }

    if (status === 'authenticated') {
      const roles = session.user.roles || [];
      if (!roles.includes('ADMIN')) {
        router.push('/');
        return;
      }
      fetchUsers();
    }
  }, [status, session, router, pagination.page, filters]);

  // Buscar usuários
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do usuário
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar status');
      }

      toast.success('Status atualizado com sucesso');
      fetchUsers();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error(error.message || 'Erro ao atualizar status');
    }
  };

  // Definir colunas da tabela
  const columns: ColumnDef<AdminUser>[] = [
    {
      key: 'name',
      label: 'Usuário',
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (_, user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => {
            const roleLabels: Record<string, string> = {
              CUSTOMER: 'Cliente',
              SELLER: 'Vendedor',
              INSTRUCTOR: 'Instrutor',
              ADMIN: 'Admin',
            };
            return (
              <Badge key={role} variant="outline">
                {roleLabels[role] || role}
              </Badge>
            );
          })}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, user) => <StatusBadge status={user.status} type="user" />,
    },
    {
      key: 'createdAt',
      label: 'Cadastro',
      render: (_, user) => (
        <div>
          <div className="text-sm">{formatDate(user.createdAt)}</div>
          <div className="text-xs text-muted-foreground">
            {formatRelativeTime(user.createdAt)}
          </div>
        </div>
      ),
    },
    {
      key: 'lastLoginAt',
      label: 'Último Login',
      render: (_, user) =>
        user.lastLoginAt ? (
          <div>
            <div className="text-sm">{formatDate(user.lastLoginAt)}</div>
            <div className="text-xs text-muted-foreground">
              {formatRelativeTime(user.lastLoginAt)}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Nunca</span>
        ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, user) => (
        <div className="flex items-center gap-2">
          {user.status === 'ACTIVE' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(user.id, 'INACTIVE')}
              title="Desativar usuário"
            >
              <Ban className="h-4 w-4 text-red-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(user.id, 'ACTIVE')}
              title="Ativar usuário"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
          )}
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
            <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
            <p className="text-muted-foreground mt-2">
              Visualize e gerencie todos os usuários da plataforma
            </p>
          </div>

          {/* Filtros */}
          <FilterBar
            searchValue={filters.search}
            searchPlaceholder="Buscar por nome ou email..."
            onSearchChange={(value) => {
              setFilters({ ...filters, search: value });
              setPagination({ ...pagination, page: 1 });
            }}
            filters={[
              {
                type: 'select',
                key: 'role',
                label: 'Role',
                value: filters.role,
                options: USER_ROLE_OPTIONS,
                onChange: (value) => {
                  setFilters({ ...filters, role: value });
                  setPagination({ ...pagination, page: 1 });
                },
              },
              {
                type: 'select',
                key: 'status',
                label: 'Status',
                value: filters.status,
                options: USER_STATUS_OPTIONS,
                onChange: (value) => {
                  setFilters({ ...filters, status: value });
                  setPagination({ ...pagination, page: 1 });
                },
              },
            ]}
            onReset={() => {
              setFilters({ role: '', status: '', search: '' });
              setPagination({ ...pagination, page: 1 });
            }}
          />

          {/* Tabela */}
          <div className="mt-6">
            <DataTable
              columns={columns}
              data={users}
              pagination={pagination}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              loading={loading}
              emptyMessage="Nenhum usuário encontrado"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
