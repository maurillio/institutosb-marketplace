'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DollarSign } from 'lucide-react';

interface Payout {
  id: string;
  amount: number;
  fee: number;
  status: string;
  createdAt: string;
  order: {
    id: string;
    createdAt: string;
  };
}

export default function SellerPayoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    } else if (status === 'authenticated') {
      if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
        router.push('/');
      } else {
        fetchPayouts();
      }
    }
  }, [status, session, router]);

  const fetchPayouts = async () => {
    try {
      const response = await fetch('/api/seller/payouts');
      if (!response.ok) throw new Error('Erro');
      const data = await response.json();
      setPayouts(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPending = payouts
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCompleted = payouts
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

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
          <h1 className="text-3xl font-bold">Pagamentos</h1>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm text-muted-foreground">Disponível para Saque</p>
              <p className="mt-2 text-3xl font-bold text-primary">
                R$ {totalPending.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm text-muted-foreground">Total Recebido</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                R$ {totalCompleted.toFixed(2)}
              </p>
            </div>
          </div>

          {payouts.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-lg border bg-white p-12">
              <DollarSign className="h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Nenhum pagamento ainda</h2>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-lg border bg-white">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Data</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Pedido</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Valor</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Taxa</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Líquido</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {new Date(payout.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">
                        #{payout.order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        R$ {(payout.amount + payout.fee).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        -R$ {payout.fee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">
                        R$ {payout.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            payout.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payout.status === 'COMPLETED' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
