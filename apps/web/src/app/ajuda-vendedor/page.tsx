'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShoppingBag, Package, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AjudaVendedorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Central de Ajuda para Vendedores</h1>
            <p className="text-xl">
              Tudo o que você precisa saber para vender com sucesso
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Como Começar a Vender</h2>
              <ol className="list-decimal ml-5 space-y-2 text-gray-700">
                <li>Crie sua conta ou faça login</li>
                <li>Acesse "Tornar-se Vendedor"</li>
                <li>Complete seu perfil de vendedor</li>
                <li>Adicione seu primeiro produto</li>
                <li>Aguarde aprovação (24h)</li>
              </ol>
              <Link
                href="/tornar-se-vendedor"
                className="inline-block mt-4 text-pink-600 hover:underline"
              >
                Tornar-se vendedor →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Gerenciando Produtos</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Use fotos de alta qualidade</li>
                <li>• Descrições detalhadas aumentam vendas</li>
                <li>• Mantenha o estoque atualizado</li>
                <li>• Defina preços competitivos</li>
                <li>• Organize por categorias</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Pagamentos e Taxas</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Taxa da plataforma:</strong> 5% por venda
                </p>
                <p>
                  <strong>Recebimento:</strong> 7 dias após entrega confirmada
                </p>
                <p>
                  <strong>Métodos:</strong> Transferência bancária ou PIX
                </p>
                <p>
                  <strong>Saques:</strong> Disponíveis semanalmente
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Dicas para Vender Mais</h2>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Responda perguntas rapidamente</li>
                <li>✓ Envie pedidos dentro do prazo</li>
                <li>✓ Mantenha fotos profissionais</li>
                <li>✓ Ofereça bom atendimento</li>
                <li>✓ Peça avaliações aos clientes</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  Quanto tempo leva para minha conta ser aprovada?
                </h3>
                <p className="text-gray-700">
                  A aprovação geralmente ocorre em até 24 horas úteis após o
                  cadastro completo.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Como faço para adicionar um produto?
                </h3>
                <p className="text-gray-700">
                  Acesse seu Dashboard de Vendedor e clique em "Novo Produto".
                  Preencha todas as informações e adicione fotos de qualidade.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Posso cancelar um pedido?
                </h3>
                <p className="text-gray-700">
                  Sim, antes do envio você pode cancelar um pedido. Entre em
                  contato com o suporte se necessário.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Como funciona o frete?
                </h3>
                <p className="text-gray-700">
                  O frete é calculado automaticamente com base no CEP do comprador
                  e nas dimensões/peso do produto.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">
              Não encontrou o que procurava?
            </p>
            <Link
              href="/contato"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
