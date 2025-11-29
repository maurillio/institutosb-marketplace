'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { ShoppingBag, GraduationCap, CheckCircle } from 'lucide-react';

export default function TornarSeVendedorPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBecomeSeller = async () => {
    if (!session?.user?.id) {
      router.push('/entrar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar roles atuais do usuário
      const currentRoles = session.user.roles || ['CUSTOMER'];

      // Adicionar SELLER se ainda não tiver
      const newRoles = Array.from(new Set([...currentRoles, 'SELLER']));

      const response = await fetch(`/api/admin/users/${session.user.id}/roles`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: newRoles }),
      });

      if (!response.ok) {
        // Se não for admin, fazer auto-promoção
        const selfResponse = await fetch('/api/user/upgrade-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'SELLER' }),
        });

        if (!selfResponse.ok) {
          throw new Error('Erro ao se tornar vendedor');
        }
      }

      // Atualizar sessão
      await update();

      // Redirecionar para dashboard
      router.push('/dashboard/vendedor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeInstructor = async () => {
    if (!session?.user?.id) {
      router.push('/entrar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar roles atuais do usuário
      const currentRoles = session.user.roles || ['CUSTOMER'];

      // Adicionar INSTRUCTOR se ainda não tiver
      const newRoles = Array.from(new Set([...currentRoles, 'INSTRUCTOR']));

      const response = await fetch(`/api/admin/users/${session.user.id}/roles`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: newRoles }),
      });

      if (!response.ok) {
        // Se não for admin, fazer auto-promoção
        const selfResponse = await fetch('/api/user/upgrade-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'INSTRUCTOR' }),
        });

        if (!selfResponse.ok) {
          throw new Error('Erro ao se tornar instrutor');
        }
      }

      // Atualizar sessão
      await update();

      // Redirecionar para dashboard
      router.push('/dashboard/instrutor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Faça login para continuar</h1>
            <Button onClick={() => router.push('/entrar')}>
              Fazer Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Comece a Vender ou Ensinar
              </h1>
              <p className="text-lg text-gray-600">
                Escolha como você quer fazer parte do The Beauty Pro
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Card Vendedor */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-pink-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">
                  Torne-se Vendedor
                </h2>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Venda produtos de beleza
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Gerencie seu estoque
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Receba pagamentos online
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Dashboard com analytics
                    </span>
                  </li>
                </ul>

                <Button
                  onClick={handleBecomeSeller}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processando...' : 'Quero Vender'}
                </Button>
              </div>

              {/* Card Instrutor */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">
                  Torne-se Instrutor
                </h2>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Crie cursos online
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Ofereça aulas presenciais
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Gerencie suas turmas
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Emita certificados
                    </span>
                  </li>
                </ul>

                <Button
                  onClick={handleBecomeInstructor}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processando...' : 'Quero Ensinar'}
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600">
                Você pode ser vendedor e instrutor ao mesmo tempo!
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
