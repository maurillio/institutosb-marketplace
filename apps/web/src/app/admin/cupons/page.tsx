'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { Card } from '@thebeautypro/ui/card';
import { Plus, Tag, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  applicability: string;
  maxUses: number | null;
  maxUsesPerUser: number | null;
  currentUses: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  description: string | null;
  _count: {
    usages: number;
  };
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  // Verificar se é admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    }
    if (status === 'authenticated' && !session?.user?.roles?.includes('ADMIN')) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchCoupons();
  }, [filter]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/admin/coupons?${params}`);
      if (!response.ok) throw new Error('Erro ao buscar cupons');

      const data = await response.json();
      setCoupons(data.coupons);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
      toast.error('Erro ao carregar cupons');
    } finally {
      setLoading(false);
    }
  };

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar cupom');

      toast.success(`Cupom ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
      fetchCoupons();
    } catch (error) {
      console.error('Erro ao atualizar cupom:', error);
      toast.error('Erro ao atualizar cupom');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cupom?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar cupom');
      }

      toast.success('Cupom deletado com sucesso');
      fetchCoupons();
    } catch (error: any) {
      console.error('Erro ao deletar cupom:', error);
      toast.error(error.message || 'Erro ao deletar cupom');
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null;

    if (!coupon.isActive) {
      return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">Inativo</span>;
    }

    if (validFrom > now) {
      return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">Agendado</span>;
    }

    if (validUntil && validUntil < now) {
      return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Expirado</span>;
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Esgotado</span>;
    }

    return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Ativo</span>;
  };

  if (status === 'loading' || loading) {
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
        <div className="container py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Cupons de Desconto</h1>
              <p className="mt-1 text-muted-foreground">
                Gerencie cupons e promoções
              </p>
            </div>
            <Link href="/admin/cupons/novo">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cupom
              </Button>
            </Link>
          </div>

          {/* Filtros */}
          <Card className="mb-6 p-4">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                onClick={() => setFilter('active')}
                size="sm"
              >
                Ativos
              </Button>
              <Button
                variant={filter === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilter('inactive')}
                size="sm"
              >
                Inativos
              </Button>
              <Button
                variant={filter === 'expired' ? 'default' : 'outline'}
                onClick={() => setFilter('expired')}
                size="sm"
              >
                Expirados
              </Button>
            </div>
          </Card>

          {/* Lista de cupons */}
          <div className="space-y-4">
            {coupons.length === 0 ? (
              <Card className="p-12 text-center">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhum cupom encontrado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Crie seu primeiro cupom para começar
                </p>
                <Link href="/admin/cupons/novo">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Cupom
                  </Button>
                </Link>
              </Card>
            ) : (
              coupons.map((coupon) => (
                <Card key={coupon.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                          <Tag className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold">{coupon.code}</h3>
                            {getStatusBadge(coupon)}
                          </div>
                          {coupon.description && (
                            <p className="text-sm text-muted-foreground">
                              {coupon.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Tipo</p>
                          <p className="font-medium">
                            {coupon.type === 'PERCENTAGE'
                              ? `${coupon.value}% de desconto`
                              : `R$ ${coupon.value.toFixed(2)} de desconto`}
                          </p>
                          {coupon.type === 'PERCENTAGE' && coupon.maxDiscount && (
                            <p className="text-xs text-muted-foreground">
                              Máx: R$ {coupon.maxDiscount.toFixed(2)}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Usos</p>
                          <p className="font-medium">
                            {coupon.currentUses}
                            {coupon.maxUses ? ` / ${coupon.maxUses}` : ' / Ilimitado'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Validade</p>
                          <p className="font-medium">
                            {new Date(coupon.validFrom).toLocaleDateString('pt-BR')}
                            {coupon.validUntil && (
                              <> até {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}</>
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Pedido mínimo</p>
                          <p className="font-medium">
                            {coupon.minOrderValue
                              ? `R$ ${coupon.minOrderValue.toFixed(2)}`
                              : 'Nenhum'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCouponStatus(coupon.id, coupon.isActive)}
                      >
                        {coupon.isActive ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/admin/cupons/${coupon.id}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCoupon(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
