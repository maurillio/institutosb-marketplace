import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

/**
 * Webhook do Mercado Pago para pagamentos recorrentes (assinaturas)
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, action } = body;

    console.log('[MP Webhook Subscription] Recebido:', { type, action, id: data?.id });

    // Verificar se é notificação de assinatura
    if (type === 'subscription' || type === 'subscription_preapproval') {
      const subscriptionId = data?.id;

      if (!subscriptionId) {
        return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
      }

      // Buscar detalhes da assinatura no MP
      const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
      if (!mpAccessToken) {
        console.error('[MP Webhook] Token de acesso não configurado');
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
      }

      const subscriptionResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
          },
        }
      );

      if (!subscriptionResponse.ok) {
        console.error('[MP Webhook] Erro ao buscar assinatura:', subscriptionResponse.status);
        return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
      }

      const subscription = await subscriptionResponse.json();
      console.log('[MP Webhook] Assinatura:', {
        id: subscription.id,
        status: subscription.status,
        external_reference: subscription.external_reference,
      });

      // external_reference deve conter o userId
      const userId = subscription.external_reference;
      if (!userId) {
        console.error('[MP Webhook] external_reference não encontrado');
        return NextResponse.json({ received: true });
      }

      // Buscar sellerProfile do usuário
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId },
      });

      if (!sellerProfile) {
        console.error('[MP Webhook] SellerProfile não encontrado para userId:', userId);
        return NextResponse.json({ received: true });
      }

      // Atualizar status da assinatura baseado no status do MP
      let newPlan = sellerProfile.plan;
      let newStatus: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' = 'ACTIVE';

      if (subscription.status === 'authorized' || subscription.status === 'paused') {
        newStatus = 'ACTIVE';
        // Determinar plano baseado no preapproval_plan_id ou auto_recurring.transaction_amount
        const planValue = subscription.auto_recurring?.transaction_amount || 0;
        if (planValue >= 199) {
          newPlan = 'PREMIUM';
        } else if (planValue >= 79) {
          newPlan = 'PRO';
        } else if (planValue >= 29) {
          newPlan = 'BASIC';
        }
      } else if (subscription.status === 'cancelled') {
        newStatus = 'CANCELLED';
        newPlan = 'FREE';
      } else if (subscription.status === 'pending') {
        newStatus = 'PAST_DUE';
      }

      // Atualizar no banco
      await prisma.sellerProfile.update({
        where: { userId },
        data: {
          plan: newPlan,
          subscriptionStatus: newStatus,
          subscriptionId: subscription.id,
          subscriptionEndsAt:
            subscription.status === 'authorized' && subscription.next_payment_date
              ? new Date(subscription.next_payment_date)
              : subscription.status === 'cancelled'
              ? new Date()
              : sellerProfile.subscriptionEndsAt,
        },
      });

      console.log('[MP Webhook] Assinatura atualizada:', {
        userId,
        plan: newPlan,
        status: newStatus,
      });

      // TODO: Enviar email de confirmação/renovação para o usuário

      return NextResponse.json({ received: true });
    }

    // Tipo de notificação não tratado
    console.log('[MP Webhook] Tipo de notificação não tratado:', type);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[MP Webhook Subscription] Erro:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint para teste e verificação
 */
export async function GET() {
  return NextResponse.json({
    message: 'Webhook Mercado Pago Subscription',
    status: 'active',
    endpoint: '/api/webhooks/mercadopago/subscription',
  });
}
