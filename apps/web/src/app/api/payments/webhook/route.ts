import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// POST /api/payments/webhook - Webhook do Mercado Pago
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log('Webhook recebido:', { type, data });

    // Processar apenas notificações de pagamento
    if (type === 'payment') {
      const paymentId = data.id;

      // Buscar informações do pagamento no Mercado Pago
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        console.error('Erro ao buscar pagamento:', await response.text());
        return NextResponse.json(
          { error: 'Erro ao processar webhook' },
          { status: 500 }
        );
      }

      const payment = await response.json();
      const orderId = payment.external_reference;
      const status = payment.status;

      // Mapear status do Mercado Pago para status do pedido
      let orderStatus: string;
      let paymentStatus: string;

      switch (status) {
        case 'approved':
          orderStatus = 'CONFIRMED';
          paymentStatus = 'COMPLETED';
          break;
        case 'pending':
        case 'in_process':
          orderStatus = 'PENDING';
          paymentStatus = 'PENDING';
          break;
        case 'rejected':
        case 'cancelled':
          orderStatus = 'CANCELLED';
          paymentStatus = 'FAILED';
          break;
        default:
          orderStatus = 'PENDING';
          paymentStatus = 'PENDING';
      }

      // Atualizar ou criar registro de pagamento
      await prisma.payment.upsert({
        where: {
          orderId,
        },
        update: {
          status: paymentStatus,
          transactionId: payment.id.toString(),
          amount: payment.transaction_amount,
          method: payment.payment_method_id,
          metadata: JSON.stringify(payment),
        },
        create: {
          orderId,
          status: paymentStatus,
          transactionId: payment.id.toString(),
          amount: payment.transaction_amount,
          method: payment.payment_method_id,
          metadata: JSON.stringify(payment),
        },
      });

      // Atualizar status do pedido
      await prisma.order.update({
        where: { id: orderId },
        data: { status: orderStatus },
      });

      // Se aprovado, processar split de pagamento para vendedores
      if (status === 'approved') {
        await processarSplitPagamento(orderId, payment);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, message: 'Tipo de notificação ignorado' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

// Função para processar split de pagamento
async function processarSplitPagamento(orderId: string, payment: any) {
  try {
    // Buscar itens do pedido
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!order) {
      console.error('Pedido não encontrado para split:', orderId);
      return;
    }

    // Agrupar itens por vendedor
    const vendasPorVendedor = new Map<string, number>();

    for (const item of order.items) {
      const sellerId = item.sellerId;
      const valorVenda = item.total;

      const totalAtual = vendasPorVendedor.get(sellerId) || 0;
      vendasPorVendedor.set(sellerId, totalAtual + valorVenda);
    }

    // Criar registros de payout para cada vendedor
    for (const [sellerId, valor] of vendasPorVendedor) {
      // Taxa do marketplace (10%)
      const taxaMarketplace = valor * 0.1;
      const valorVendedor = valor - taxaMarketplace;

      await prisma.payout.create({
        data: {
          sellerId,
          orderId,
          amount: valorVendedor,
          fee: taxaMarketplace,
          status: 'PENDING',
        },
      });

      // Atualizar total de vendas do vendedor
      await prisma.sellerProfile.update({
        where: { id: sellerId },
        data: {
          totalSales: {
            increment: 1,
          },
        },
      });
    }

    console.log('Split de pagamento processado para pedido:', orderId);
  } catch (error) {
    console.error('Erro ao processar split de pagamento:', error);
  }
}

// GET - Endpoint de verificação
export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint ativo' });
}
