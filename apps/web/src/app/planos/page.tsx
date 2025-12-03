'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  description: string;
  highlights: string[];
  features: {
    seller: any;
    instructor: any;
  };
}

interface CurrentSubscription {
  currentPlan: string;
  planExpiresAt: string | null;
  isExpired: boolean;
  profileType: 'seller' | 'instructor' | null;
  roles: string[];
}

export default function PlanosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    if (session?.user) {
      fetchCurrentSubscription();
    }
  }, [session]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription/plans');
      const data = await response.json();
      setPlans(data.plans);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data);
      }
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (status !== 'authenticated') {
      toast.error('Você precisa estar logado para assinar um plano');
      router.push('/login?redirect=/planos');
      return;
    }

    // Verificar se usuário tem perfil de vendedor ou instrutor
    if (!currentSubscription?.profileType) {
      toast.error('Você precisa ter um perfil de vendedor ou instrutor para assinar um plano');
      return;
    }

    setSubscribing(planId);

    try {
      const response = await fetch('/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          profileType: currentSubscription.profileType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Assinatura realizada com sucesso!');
        fetchCurrentSubscription();
      } else {
        toast.error(data.error || 'Erro ao assinar plano');
      }
    } catch (error) {
      console.error('Erro ao assinar:', error);
      toast.error('Erro ao processar assinatura');
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expanda seu negócio de beleza com os melhores recursos do mercado.
            Comece grátis e faça upgrade quando quiser.
          </p>
        </div>

        {/* Current Plan Badge */}
        {currentSubscription && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full">
              <Check className="w-4 h-4" />
              <span className="font-medium">
                Plano atual: {currentSubscription.currentPlan}
                {currentSubscription.profileType && ` (${currentSubscription.profileType === 'seller' ? 'Vendedor' : 'Instrutor'})`}
              </span>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.currentPlan === plan.id;
            const isPremium = plan.id === 'PRO' || plan.id === 'PREMIUM';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 ${
                  isPremium
                    ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                      ⭐ Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${isPremium ? 'text-pink-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className={`text-4xl font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price === 0 ? (
                      'Grátis'
                    ) : (
                      <>
                        R$ {plan.price.toFixed(2)}
                        <span className={`text-lg font-normal ${isPremium ? 'text-pink-100' : 'text-gray-600'}`}>
                          /mês
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPremium ? 'text-pink-200' : 'text-pink-600'}`} />
                      <span className={`text-sm ${isPremium ? 'text-white' : 'text-gray-700'}`}>
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isPremium
                      ? 'bg-white text-pink-600 hover:bg-pink-50'
                      : isCurrentPlan
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan || subscribing === plan.id}
                >
                  {subscribing === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Processando...
                    </span>
                  ) : isCurrentPlan ? (
                    'Plano Atual'
                  ) : (
                    'Assinar Agora'
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Comparação Completa</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Recurso</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Básico</th>
                  <th className="text-center py-4 px-4 font-semibold text-pink-600">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-600">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Produtos (Vendedores)</td>
                  <td className="py-4 px-4 text-center text-gray-600">5</td>
                  <td className="py-4 px-4 text-center text-gray-600">20</td>
                  <td className="py-4 px-4 text-center text-gray-600">100</td>
                  <td className="py-4 px-4 text-center text-purple-600 font-bold">Ilimitado</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Cursos (Instrutores)</td>
                  <td className="py-4 px-4 text-center text-gray-600">2</td>
                  <td className="py-4 px-4 text-center text-gray-600">10</td>
                  <td className="py-4 px-4 text-center text-gray-600">50</td>
                  <td className="py-4 px-4 text-center text-purple-600 font-bold">Ilimitado</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Taxa de Comissão (Vendedores)</td>
                  <td className="py-4 px-4 text-center text-gray-600">15%</td>
                  <td className="py-4 px-4 text-center text-gray-600">12%</td>
                  <td className="py-4 px-4 text-center text-pink-600">10%</td>
                  <td className="py-4 px-4 text-center text-purple-600 font-bold">8%</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Taxa de Comissão (Instrutores)</td>
                  <td className="py-4 px-4 text-center text-gray-600">20%</td>
                  <td className="py-4 px-4 text-center text-gray-600">15%</td>
                  <td className="py-4 px-4 text-center text-pink-600">12%</td>
                  <td className="py-4 px-4 text-center text-purple-600 font-bold">10%</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Produtos em Destaque</td>
                  <td className="py-4 px-4 text-center text-gray-400">-</td>
                  <td className="py-4 px-4 text-center text-gray-600">2</td>
                  <td className="py-4 px-4 text-center text-gray-600">5</td>
                  <td className="py-4 px-4 text-center text-gray-600">15</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Analytics</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Certificados</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Aulas ao Vivo</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Suporte</td>
                  <td className="py-4 px-4 text-center text-gray-600">Padrão</td>
                  <td className="py-4 px-4 text-center text-gray-600">Padrão</td>
                  <td className="py-4 px-4 text-center text-pink-600">Prioritário</td>
                  <td className="py-4 px-4 text-center text-purple-600 font-bold">VIP 24/7</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-700">Domínio Personalizado</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-green-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Dúvidas?</h2>
          <p className="text-gray-600 mb-8">
            Entre em contato conosco e nossa equipe terá prazer em ajudar você a escolher o melhor plano.
          </p>
          <Button className="bg-pink-600 text-white hover:bg-pink-700">
            Falar com Suporte
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
