import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// POST /api/payments/create-preference - Criar preferência de pagamento no Mercado Pago
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, items, total } = body;

    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN não configurado');
      return NextResponse.json(
        { error: 'Configuração de pagamento inválida' },
        { status: 500 }
      );
    }

    // Preparar itens para o Mercado Pago
    const mpItems = items.map((item: any) => ({
      id: item.productId,
      title: item.name,
      description: item.name,
      picture_url: item.imageUrl,
      category_id: 'beauty',
      quantity: item.quantity,
      unit_price: item.price,
    }));

    // Criar preferência de pagamento
    const preference = {
      items: mpItems,
      payer: {
        name: session.user.name,
        email: session.user.email,
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/pedido/${orderId}/sucesso`,
        failure: `${process.env.NEXTAUTH_URL}/checkout?error=payment_failed`,
        pending: `${process.env.NEXTAUTH_URL}/pedido/${orderId}/pendente`,
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook`,
      statement_descriptor: 'THE BEAUTY PRO',
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      // Split de pagamento para marketplace
      // marketplace_fee: calcularTaxaMarketplace(total),
    };

    // Fazer requisição para o Mercado Pago
    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(preference),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao criar preferência MP:', error);
      return NextResponse.json(
        { error: 'Erro ao processar pagamento' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}

// Função auxiliar para calcular taxa do marketplace
function calcularTaxaMarketplace(total: number): number {
  // Taxa de 10% do marketplace
  return total * 0.1;
}
