'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import {
  Package,
  MapPin,
  User,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  platformFee: number;
  sellerAmount: number;
  trackingCode: string | null;
  shippingCarrier: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  buyer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  address: {
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    method: string;
    status: string;
    amount: number;
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    } else if (status === 'authenticated') {
      if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
        router.push('/');
      } else {
        fetchOrder();
      }
    }
  }, [status, session, router, params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/seller/orders/${params.id}`);
      if (!response.ok) throw new Error('Erro');
      const data = await response.json();
      setOrder(data);
      setTrackingCode(data.trackingCode || '');
      setShippingCarrier(data.shippingCarrier || '');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar pedido');
      router.push('/dashboard/vendedor/pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Selecione um status');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/seller/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Erro');

      toast.success('Status atualizado com sucesso');
      setShowStatusModal(false);
      fetchOrder();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!trackingCode.trim()) {
      toast.error('Digite o código de rastreio');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/seller/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode: trackingCode.trim(),
          shippingCarrier: shippingCarrier.trim() || null,
        }),
      });

      if (!response.ok) throw new Error('Erro');

      toast.success('Código de rastreio adicionado com sucesso');
      setShowTrackingModal(false);
      fetchOrder();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao adicionar código de rastreio');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-500 text-white',
      CANCELLED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Aguardando Pagamento',
      PAID: 'Pago',
      PROCESSING: 'Em Processamento',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
      REFUNDED: 'Reembolsado',
    };
    return labels[status] || status;
  };

  const getNextStatuses = (currentStatus: string) => {
    const flow: Record<string, string[]> = {
      PENDING: [],
      PAID: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
      REFUNDED: [],
    };
    return flow[currentStatus] || [];
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

  if (!order) return null;

  const nextStatuses = getNextStatuses(order.status);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard/vendedor/pedidos')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">
                  Pedido #{order.orderNumber}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadge(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Produtos */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Package className="h-5 w-5" />
                  Produtos
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b pb-4 last:border-0"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.product.images[0] || 'https://via.placeholder.com/80'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/produtos/${item.product.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity} × R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span>R$ {order.shippingCost.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto</span>
                      <span>- R$ {order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa da plataforma</span>
                    <span className="text-red-600">- R$ {order.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-green-600">
                    <span>Você recebe</span>
                    <span>R$ {order.sellerAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </h2>
                <div className="text-sm">
                  <p>{order.address.street}, {order.address.number}</p>
                  {order.address.complement && <p>{order.address.complement}</p>}
                  <p>{order.address.neighborhood}</p>
                  <p>
                    {order.address.city} - {order.address.state}
                  </p>
                  <p className="mt-2 font-medium">CEP: {order.address.zipCode}</p>
                </div>
              </div>

              {/* Rastreamento */}
              {order.trackingCode && (
                <div className="rounded-lg border bg-blue-50 p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <Truck className="h-5 w-5" />
                    Rastreamento
                  </h2>
                  <div className="text-sm">
                    {order.shippingCarrier && (
                      <p className="text-muted-foreground">
                        Transportadora: {order.shippingCarrier}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-lg font-bold">
                      {order.trackingCode}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ações */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 text-lg font-bold">Ações</h2>
                <div className="space-y-3">
                  {nextStatuses.length > 0 && (
                    <Button
                      className="w-full"
                      onClick={() => setShowStatusModal(true)}
                    >
                      Atualizar Status
                    </Button>
                  )}
                  {(order.status === 'PROCESSING' || order.status === 'SHIPPED') && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowTrackingModal(true)}
                    >
                      {order.trackingCode ? 'Alterar' : 'Adicionar'} Rastreio
                    </Button>
                  )}
                </div>
              </div>

              {/* Cliente */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <User className="h-5 w-5" />
                  Cliente
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{order.buyer.name}</p>
                  <p className="text-muted-foreground">{order.buyer.email}</p>
                  {order.buyer.phone && (
                    <p className="text-muted-foreground">{order.buyer.phone}</p>
                  )}
                </div>
              </div>

              {/* Pagamento */}
              {order.payment && (
                <div className="rounded-lg border bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <CreditCard className="h-5 w-5" />
                    Pagamento
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Método</span>
                      <span className="font-medium">{order.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">{order.payment.status}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Valor</span>
                      <span className="font-bold">
                        R$ {order.payment.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Clock className="h-5 w-5" />
                  Histórico
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pedido criado</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {order.paidAt && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pagamento confirmado</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.paidAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.shippedAt && (
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pedido enviado</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.shippedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pedido entregue</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.deliveredAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal Atualizar Status */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status do Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Novo Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">Selecione...</option>
                {nextStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
                disabled={updating}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateStatus} disabled={updating}>
                {updating ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Adicionar Rastreio */}
      <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {order.trackingCode ? 'Alterar' : 'Adicionar'} Código de Rastreio
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Transportadora
              </label>
              <input
                type="text"
                value={shippingCarrier}
                onChange={(e) => setShippingCarrier(e.target.value)}
                placeholder="Ex: Correios, Jadlog..."
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Código de Rastreio *
              </label>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Ex: BR123456789BR"
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm font-mono"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTrackingModal(false)}
                disabled={updating}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateTracking} disabled={updating}>
                {updating ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
