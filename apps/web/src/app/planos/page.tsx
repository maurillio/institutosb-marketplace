'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { Check } from 'lucide-react';

export default function PlanosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-center">
              Escolha seu Plano
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              Planos flexíveis para todos os tipos de profissionais
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Plano Básico */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold mb-2">Básico</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Grátis</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Comprar produtos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Acessar cursos gratuitos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Lista de desejos</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Começar Grátis
                </Button>
              </div>

              {/* Plano Vendedor */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-pink-500 relative">
                <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 text-sm rounded-bl-lg">
                  Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Vendedor</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">5%</span>
                  <span className="text-gray-600"> por venda</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tudo do plano Básico</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Vender produtos ilimitados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Dashboard de vendas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full">
                  Tornar-se Vendedor
                </Button>
              </div>

              {/* Plano Instrutor */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold mb-2">Instrutor</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">10%</span>
                  <span className="text-gray-600"> por matrícula</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tudo do plano Básico</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Criar cursos ilimitados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Emitir certificados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Analytics detalhado</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Tornar-se Instrutor
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center text-gray-600">
              <p>Todos os planos incluem pagamentos seguros e suporte ao cliente</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
