'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShoppingBag, GraduationCap, Users, Award } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre o The Beauty Pro
              </h1>
              <p className="text-xl">
                O marketplace completo para profissionais de beleza comprarem,
                venderem e aprenderem.
              </p>
            </div>
          </div>
        </div>

        {/* Nossa Missão */}
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Nossa Missão</h2>
            <p className="text-lg text-gray-700 text-center mb-12">
              Conectar profissionais de beleza em um ecossistema completo,
              oferecendo produtos de qualidade, cursos especializados e
              oportunidades de crescimento profissional.
            </p>

            {/* Cards de Valores */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Marketplace</h3>
                <p className="text-sm text-gray-600">
                  Compre e venda produtos de beleza profissionais
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Cursos</h3>
                <p className="text-sm text-gray-600">
                  Aprenda com os melhores profissionais
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Comunidade</h3>
                <p className="text-sm text-gray-600">
                  Conecte-se com outros profissionais
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Qualidade</h3>
                <p className="text-sm text-gray-600">
                  Produtos e cursos certificados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nossa História */}
        <div className="bg-white py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Nossa História</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  O The Beauty Pro nasceu da necessidade de criar um espaço único
                  onde profissionais de beleza pudessem encontrar tudo o que
                  precisam em um só lugar.
                </p>
                <p>
                  Combinamos três pilares fundamentais: um marketplace para
                  compra e venda de produtos profissionais, uma plataforma de
                  cursos com os melhores instrutores do mercado, e uma
                  comunidade vibrante de profissionais apaixonados por beleza.
                </p>
                <p>
                  Hoje, somos a referência para milhares de profissionais que
                  confiam em nossa plataforma para impulsionar seus negócios e
                  carreiras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
