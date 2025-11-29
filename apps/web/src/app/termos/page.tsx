'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e usar o The Beauty Pro, você concorda em cumprir
                  e estar vinculado aos seguintes termos e condições de uso.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Uso da Plataforma</h2>
                <p>
                  Nossa plataforma é destinada a profissionais de beleza para
                  compra, venda e aprendizado. Você se compromete a usar a
                  plataforma apenas para fins legais e de acordo com estes termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Cadastro de Conta</h2>
                <p>
                  Para acessar determinados recursos, você deve criar uma conta.
                  Você é responsável por manter a confidencialidade de suas
                  credenciais e por todas as atividades que ocorram em sua conta.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Vendedores</h2>
                <p>
                  Os vendedores são responsáveis pela precisão das informações
                  dos produtos, cumprimento de prazos de entrega e qualidade dos
                  produtos vendidos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Compradores</h2>
                <p>
                  Os compradores devem fornecer informações precisas para entrega
                  e pagamento. As compras estão sujeitas às políticas de devolução
                  de cada vendedor.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Instrutores e Cursos</h2>
                <p>
                  Os instrutores são responsáveis pelo conteúdo de seus cursos.
                  O acesso aos cursos é pessoal e intransferível.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Pagamentos</h2>
                <p>
                  Todos os pagamentos são processados de forma segura através de
                  nossos parceiros de pagamento. O The Beauty Pro cobra uma taxa
                  de serviço sobre as transações.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo da plataforma, incluindo texto, gráficos,
                  logotipos e software, é propriedade do The Beauty Pro ou de
                  seus licenciadores.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Modificações dos Termos</h2>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer
                  momento. Notificaremos os usuários sobre mudanças significativas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
                <p>
                  Para dúvidas sobre estes termos, entre em contato através do
                  email: contato@thebeautypro.com.br
                </p>
              </section>

              <p className="text-sm text-gray-500 mt-8">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
