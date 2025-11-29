'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function NovidadesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Novidades</h1>

            <div className="space-y-8">
              <article className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date().toLocaleDateString('pt-BR')}
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Bem-vindo ao The Beauty Pro
                </h2>
                <p className="text-gray-700">
                  Estamos felizes em ter você aqui! O The Beauty Pro é a
                  plataforma completa para profissionais de beleza. Fique atento
                  às novidades que estaremos trazendo.
                </p>
              </article>

              <div className="text-center text-gray-600">
                <p>Mais novidades em breve...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
