'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, ShoppingBag, Truck, Star, X } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  trackingCode: string | null;
  shippingCarrier: string | null;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  payment: {
    status: string;
  } | null;
}

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/meus-pedidos');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (!response.ok) throw new Error('Erro ao cancelar pedido');

      toast.success('Pedido cancelado com sucesso');
      fetchOrders();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao cancelar pedido');
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      PENDING: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800' },
      PAID: { label: 'Pago', color: 'bg-green-100 text-green-800' },
      PROCESSING: { label: 'Em Preparação', color: 'bg-blue-100 text-blue-800' },
      SHIPPED: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
      DELIVERED: { label: 'Entregue', color: 'bg-green-500 text-white' },
      CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
      REFUNDED: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Carregando pedidos...</p>
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
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os seus pedidos
          </p>

          {orders.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-lg border bg-white p-12">
              <ShoppingBag className="h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">
                Você ainda não fez nenhum pedido
              </h2>
              <p className="mt-2 text-muted-foreground">
                Comece a explorar nossos produtos
              </p>
              <Button asChild className="mt-6">
                <Link href="/produtos">Ver Produtos</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusLabel(order.status);
                const canCancel = order.status === 'PENDING';
                const canReview = order.status === 'DELIVERED';

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="border-b bg-gray-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Pedido
                            </p>
                            <p className="font-mono font-semibold">
                              #{order.orderNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Data
                            </p>
                            <p className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total
                            </p>
                            <p className="font-bold text-primary">
                              R$ {order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Rastreamento */}
                      {order.trackingCode && (
                        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-medium text-blue-900">
                                Código de rastreamento
                              </p>
                              <p className="font-mono text-sm text-blue-700">
                                {order.trackingCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Itens do pedido */}
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                              <Image
                                src={
                                  item.product.images[0] ||
                                  'https://via.placeholder.com/80'
                                }
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium line-clamp-1">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qtd: {item.quantity} × R$ {item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-bold text-sm sm:text-base">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}

                        {order.items.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            + {order.items.length - 3} item(s) adicional(is)
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/meus-pedidos/${order.id}`}>
                            <Package className="mr-2 h-4 w-4" />
                            Ver Detalhes
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </Link>
                        </Button>

                        {canCancel && (
                          <Button
                            variant="outline"
                            className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar Pedido
                          </Button>
                        )}

                        {canReview && (
                          <Button asChild variant="outline" className="flex-1">
                            <Link href={`/meus-pedidos/${order.id}#reviews`}>
                              <Star className="mr-2 h-4 w-4" />
                              Avaliar Produtos
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
