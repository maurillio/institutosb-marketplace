'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import Link from 'next/link';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';

interface OrderDetails {
  id: string;
  status: string;
  total: number;
  shippingCost: number;
  subtotal: number;
  createdAt: string;
  shippingAddress: string;
  items: Array<{
    id: string;
    product: {
      name: string;
      imageUrl: string | null;
    };
    quantity: number;
    price: number;
    total: number;
  }>;
  payment: {
    status: string;
    method: string;
    amount: number;
  } | null;
}

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) {
        throw new Error('Pedido não encontrado');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      router.push('/meus-pedidos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Carregando pedido...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const address = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          {/* Mensagem de sucesso */}
          <div className="mx-auto max-w-2xl text-center">
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            <h1 className="mt-6 text-3xl font-bold">Pedido Realizado com Sucesso!</h1>
            <p className="mt-2 text-muted-foreground">
              Seu pedido foi confirmado e já está sendo processado
            </p>

            <div className="mt-6 rounded-lg border bg-white p-6">
              <p className="text-sm text-muted-foreground">Número do Pedido</p>
              <p className="mt-1 text-2xl font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Detalhes do pedido */}
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Informações de entrega */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="flex items-center gap-2 font-bold">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </h2>
                {address && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </p>
                    <p>
                      {address.neighborhood} - {address.city}/{address.state}
                    </p>
                    <p>CEP: {address.zipCode}</p>
                  </div>
                )}
              </div>

              {/* Informações de pagamento */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="flex items-center gap-2 font-bold">
                  <CreditCard className="h-5 w-5" />
                  Pagamento
                </h2>
                <div className="mt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">
                      {order.payment?.status === 'COMPLETED' && 'Aprovado'}
                      {order.payment?.status === 'PENDING' && 'Pendente'}
                      {order.payment?.status === 'FAILED' && 'Falhou'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-muted-foreground">Método:</span>
                    <span className="font-medium capitalize">
                      {order.payment?.method || 'Não informado'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Produtos do pedido */}
            <div className="mt-6 rounded-lg border bg-white p-6">
              <h2 className="flex items-center gap-2 font-bold">
                <Package className="h-5 w-5" />
                Itens do Pedido
              </h2>

              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">R$ {item.total.toFixed(2)}</p>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span>R$ {order.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/meus-pedidos">Ver Meus Pedidos</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/produtos">Continuar Comprando</Link>
              </Button>
            </div>

            {/* Informações adicionais */}
            <div className="mt-8 rounded-lg bg-blue-50 p-6 text-sm">
              <h3 className="font-semibold">O que acontece agora?</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>✓ Você receberá um e-mail de confirmação em breve</li>
                <li>✓ O vendedor será notificado e preparará seu pedido</li>
                <li>✓ Você poderá acompanhar o status em "Meus Pedidos"</li>
                <li>✓ Quando enviado, receberá o código de rastreamento</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
