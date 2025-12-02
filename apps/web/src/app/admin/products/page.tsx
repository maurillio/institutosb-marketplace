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
  AdminProduct,
  ColumnDef,
  PaginationData,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_CONDITION_OPTIONS,
} from '@/types/admin';
import { formatCurrency, formatDate } from '@/lib/format';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
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

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    condition: '',
    search: '',
  });

  // Dialog de confirmação
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | 'delete';
    productId: string;
    productName: string;
  }>({
    open: false,
    type: 'approve',
    productId: '',
    productName: '',
  });

  // Verificar autenticação e role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/admin/products');
      return;
    }

    if (status === 'authenticated') {
      const roles = session.user.roles || [];
      if (!roles.includes('ADMIN')) {
        router.push('/');
        return;
      }
      fetchProducts();
    }
  }, [status, session, router, pagination.page, filters]);

  // Buscar produtos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/admin/products?${params}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }

      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do produto
  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar produto');
      }

      const result = await response.json();
      toast.success(result.message);
      fetchProducts();
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast.error(error.message || 'Erro ao atualizar produto');
    }
  };

  // Deletar produto
  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar produto');
      }

      toast.success('Produto deletado com sucesso');
      fetchProducts();
    } catch (error: any) {
      console.error('Erro ao deletar produto:', error);
      toast.error(error.message || 'Erro ao deletar produto');
    }
  };

  // Confirmar ação
  const handleConfirm = () => {
    const { type, productId } = confirmDialog;

    if (type === 'approve') {
      handleStatusChange(productId, 'ACTIVE');
    } else if (type === 'reject') {
      handleStatusChange(productId, 'INACTIVE');
    } else if (type === 'delete') {
      handleDelete(productId);
    }

    setConfirmDialog({ ...confirmDialog, open: false });
  };

  // Definir colunas da tabela
  const columns: ColumnDef<AdminProduct>[] = [
    {
      key: 'name',
      label: 'Produto',
      render: (_, product) => (
        <div className="flex items-center space-x-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border">
            <Image
              src={product.images[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{product.name}</div>
            <div className="text-sm text-muted-foreground">
              {product.category.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'seller',
      label: 'Vendedor',
      render: (_, product) => (
        <div>
          <div className="text-sm font-medium">{product.seller.name}</div>
          <div className="text-xs text-muted-foreground">
            {product.seller.sellerProfile?.storeName || 'Sem loja'}
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Preço',
      render: (_, product) => (
        <div className="font-medium">{formatCurrency(product.price)}</div>
      ),
    },
    {
      key: 'stock',
      label: 'Estoque',
      render: (_, product) => (
        <div className={product.stock > 0 ? '' : 'text-red-600'}>
          {product.stock} un.
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, product) => <StatusBadge status={product.status} type="product" />,
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (_, product) => (
        <div className="text-sm">{formatDate(product.createdAt)}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, product) => (
        <div className="flex items-center gap-2">
          {product.status === 'DRAFT' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    type: 'approve',
                    productId: product.id,
                    productName: product.name,
                  })
                }
                title="Aprovar produto"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    type: 'reject',
                    productId: product.id,
                    productName: product.name,
                  })
                }
                title="Reprovar produto"
              >
                <XCircle className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
          {product.status === 'ACTIVE' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(product.id, 'INACTIVE')}
              title="Desativar produto"
            >
              <XCircle className="h-4 w-4 text-orange-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setConfirmDialog({
                open: true,
                type: 'delete',
                productId: product.id,
                productName: product.name,
              })
            }
            title="Deletar produto"
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
            <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
            <p className="text-muted-foreground mt-2">
              Aprove, reprove e gerencie todos os produtos da plataforma
            </p>
          </div>

          {/* Filtros */}
          <FilterBar
            searchValue={filters.search}
            searchPlaceholder="Buscar por nome, descrição ou marca..."
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
                options: PRODUCT_STATUS_OPTIONS,
                onChange: (value) => {
                  setFilters({ ...filters, status: value });
                  setPagination({ ...pagination, page: 1 });
                },
              },
              {
                type: 'select',
                key: 'condition',
                label: 'Condição',
                value: filters.condition,
                options: PRODUCT_CONDITION_OPTIONS,
                onChange: (value) => {
                  setFilters({ ...filters, condition: value });
                  setPagination({ ...pagination, page: 1 });
                },
              },
            ]}
            onReset={() => {
              setFilters({ status: '', condition: '', search: '' });
              setPagination({ ...pagination, page: 1 });
            }}
          />

          {/* Tabela */}
          <div className="mt-6">
            <DataTable
              columns={columns}
              data={products}
              pagination={pagination}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              loading={loading}
              emptyMessage="Nenhum produto encontrado"
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
              {confirmDialog.type === 'approve' && 'Aprovar Produto'}
              {confirmDialog.type === 'reject' && 'Reprovar Produto'}
              {confirmDialog.type === 'delete' && 'Deletar Produto'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'approve' &&
                `Tem certeza que deseja aprovar o produto "${confirmDialog.productName}"? Ele ficará visível na plataforma.`}
              {confirmDialog.type === 'reject' &&
                `Tem certeza que deseja reprovar o produto "${confirmDialog.productName}"? Ele será desativado.`}
              {confirmDialog.type === 'delete' &&
                `Tem certeza que deseja deletar o produto "${confirmDialog.productName}"? Esta ação não pode ser desfeita.`}
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
