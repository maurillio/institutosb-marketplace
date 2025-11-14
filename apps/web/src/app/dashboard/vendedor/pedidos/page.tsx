'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
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
}

export default function SellerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    } else if (status === 'authenticated') {
      if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
        router.push('/');
      } else {
        fetchOrders();
      }
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/seller/orders');
      if (!response.ok) throw new Error('Erro');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold">Pedidos Recebidos</h1>

          {orders.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-lg border bg-white p-12">
              <Package className="h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Nenhum pedido ainda</h2>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border bg-white p-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={item.product.imageUrl || 'https://via.placeholder.com/80'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qtd: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">R$ {item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-medium">{order.customer.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold text-primary">
                        R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
