'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacidadePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Informações que Coletamos</h2>
                <p>
                  Coletamos informações que você nos fornece diretamente, como
                  nome, email, endereço, telefone e informações de pagamento ao
                  criar uma conta ou fazer uma compra.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Como Usamos suas Informações</h2>
                <p>
                  Usamos suas informações para:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Processar transações e pedidos</li>
                  <li>Fornecer suporte ao cliente</li>
                  <li>Enviar atualizações sobre pedidos e cursos</li>
                  <li>Melhorar nossos serviços</li>
                  <li>Enviar comunicações de marketing (com seu consentimento)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Informações</h2>
                <p>
                  Compartilhamos suas informações apenas quando necessário:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Com vendedores para processar pedidos</li>
                  <li>Com processadores de pagamento</li>
                  <li>Com prestadores de serviços que nos auxiliam</li>
                  <li>Quando exigido por lei</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
                <p>
                  Usamos cookies para melhorar sua experiência, manter você
                  conectado e analisar como nosso site é usado. Você pode
                  controlar cookies através das configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Segurança</h2>
                <p>
                  Implementamos medidas de segurança para proteger suas
                  informações, incluindo criptografia e armazenamento seguro.
                  No entanto, nenhum método de transmissão pela internet é 100%
                  seguro.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
                <p>
                  Você tem o direito de:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar a exclusão de suas informações</li>
                  <li>Retirar seu consentimento para marketing</li>
                  <li>Exportar seus dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
                <p>
                  Mantemos suas informações pelo tempo necessário para fornecer
                  nossos serviços e cumprir obrigações legais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Menores de Idade</h2>
                <p>
                  Nosso serviço não é direcionado a menores de 18 anos. Não
                  coletamos intencionalmente informações de menores.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Alterações nesta Política</h2>
                <p>
                  Podemos atualizar esta política periodicamente. Notificaremos
                  você sobre mudanças significativas por email ou através de um
                  aviso em nosso site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
                <p>
                  Para questões sobre privacidade, entre em contato:
                </p>
                <p className="mt-2">
                  Email: privacidade@thebeautypro.com.br<br />
                  Endereço: Rua Exemplo, 123 - São Paulo, SP
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
