'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  ChevronLeft,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
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
      seller: {
        id: string;
        name: string;
      };
    };
  }>;
}

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/meus-pedidos/' + params.id);
    } else if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, params.id, router]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Pedido não encontrado');
        } else if (response.status === 403) {
          toast.error('Você não tem permissão para ver este pedido');
        }
        throw new Error('Erro');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Erro:', error);
      router.push('/meus-pedidos');
    } finally {
      setLoading(false);
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
      PROCESSING: 'Em Preparação',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
      REFUNDED: 'Reembolsado',
    };
    return labels[status] || status;
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

  const canReview = order.status === 'DELIVERED';

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
                onClick={() => router.push('/meus-pedidos')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">
                  Pedido #{order.orderNumber}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
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

          {/* Rastreamento Destaque */}
          {order.trackingCode && (
            <div className="mb-6 rounded-lg border border-blue-500 bg-blue-50 p-6">
              <div className="flex items-start gap-4">
                <Truck className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900">
                    Seu pedido está a caminho!
                  </h3>
                  {order.shippingCarrier && (
                    <p className="mt-1 text-sm text-blue-700">
                      Transportadora: {order.shippingCarrier}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-xl font-bold text-blue-900">
                    {order.trackingCode}
                  </p>
                  <p className="mt-2 text-sm text-blue-600">
                    Use este código para rastrear seu pedido no site da transportadora
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
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
                          Vendido por {item.product.seller.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Quantidade: {item.quantity} × R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        {canReview && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="mt-2"
                          >
                            <Link href={`/produtos/${item.product.id}#reviews`}>
                              <Star className="mr-1 h-3 w-3" />
                              Avaliar
                            </Link>
                          </Button>
                        )}
                      </div>
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
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </h2>
                <div className="text-sm">
                  <p className="font-medium">{order.buyer.name}</p>
                  <p className="mt-2">{order.address.street}, {order.address.number}</p>
                  {order.address.complement && <p>{order.address.complement}</p>}
                  <p>{order.address.neighborhood}</p>
                  <p>
                    {order.address.city} - {order.address.state}
                  </p>
                  <p className="mt-2 font-medium">CEP: {order.address.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                      <span className="text-muted-foreground">Valor Pago</span>
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
                  Status do Pedido
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pedido realizado</p>
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

                  {(order.status === 'PROCESSING' || order.shippedAt) && (
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        className={`h-5 w-5 ${
                          order.shippedAt ? 'text-green-600' : 'text-blue-600'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pedido em preparação</p>
                        {order.shippedAt ? (
                          <p className="text-xs text-muted-foreground">Preparado</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Em andamento</p>
                        )}
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

                  {order.status === 'CANCELLED' && (
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full border-2 border-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-600">
                          Pedido cancelado
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ajuda */}
              <div className="rounded-lg border bg-gray-50 p-6">
                <h3 className="font-bold">Precisa de ajuda?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Entre em contato conosco caso tenha dúvidas sobre seu pedido.
                </p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/suporte">Falar com Suporte</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
