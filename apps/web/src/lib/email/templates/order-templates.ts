import { getEmailLayout, formatCurrency, formatDate } from './base';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationParams {
  userName: string;
  orderNumber: string;
  orderDate: Date;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount?: number;
  total: number;
  orderUrl: string;
}

export function orderConfirmationEmail(params: OrderConfirmationParams): string {
  const itemsHtml = params.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.name} <span style="color: #6b7280;">(x${item.quantity})</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatCurrency(item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  const content = `
    <h2>Pedido Confirmado! 🎉</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      Recebemos seu pedido e ele já está sendo preparado para envio.
      Você receberá atualizações sobre o status do seu pedido por email.
    </p>

    <div class="info-box">
      <strong>Pedido:</strong> ${params.orderNumber}<br>
      <strong>Data:</strong> ${formatDate(params.orderDate)}
    </div>

    <h3 style="margin-top: 32px; color: #111827;">Itens do Pedido</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="background-color: #f9fafb;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Produto</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td style="padding: 12px; font-weight: 600;">Subtotal</td>
          <td style="padding: 12px; text-align: right;">${formatCurrency(params.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 12px;">Frete</td>
          <td style="padding: 12px; text-align: right;">${formatCurrency(params.shippingCost)}</td>
        </tr>
        ${
          params.discount && params.discount > 0
            ? `
        <tr>
          <td style="padding: 12px; color: #059669;">Desconto</td>
          <td style="padding: 12px; text-align: right; color: #059669;">-${formatCurrency(params.discount)}</td>
        </tr>
        `
            : ''
        }
        <tr style="background-color: #f9fafb;">
          <td style="padding: 12px; font-weight: 700; font-size: 18px;">Total</td>
          <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px; color: #db2777;">
            ${formatCurrency(params.total)}
          </td>
        </tr>
      </tbody>
    </table>

    <a href="${params.orderUrl}" class="button">Ver Detalhes do Pedido</a>

    <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
      Em caso de dúvidas, entre em contato conosco através da nossa central de ajuda.
    </p>
  `;

  return getEmailLayout(content);
}

interface OrderStatusUpdateParams {
  userName: string;
  orderNumber: string;
  oldStatus: string;
  newStatus: string;
  statusMessage: string;
  orderUrl: string;
  trackingCode?: string;
  carrier?: string;
}

export function orderStatusUpdateEmail(params: OrderStatusUpdateParams): string {
  const statusEmojis: Record<string, string> = {
    PENDING: '⏳',
    PROCESSING: '📦',
    SHIPPED: '🚚',
    DELIVERED: '✅',
    CANCELLED: '❌',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendente',
    PROCESSING: 'Em Processamento',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
  };

  const emoji = statusEmojis[params.newStatus] || '📦';
  const statusLabel = statusLabels[params.newStatus] || params.newStatus;

  const content = `
    <h2>Atualização do Pedido ${emoji}</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>${params.statusMessage}</p>

    <div class="info-box">
      <strong>Pedido:</strong> ${params.orderNumber}<br>
      <strong>Status:</strong> ${statusLabel}
      ${
        params.trackingCode
          ? `<br><strong>Código de Rastreio:</strong> ${params.trackingCode}`
          : ''
      }
      ${params.carrier ? `<br><strong>Transportadora:</strong> ${params.carrier}` : ''}
    </div>

    ${
      params.trackingCode
        ? `
    <p style="margin-top: 24px;">
      <strong>Acompanhe sua entrega:</strong><br>
      Use o código <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${params.trackingCode}</code>
      no site da transportadora para rastrear seu pedido em tempo real.
    </p>
    `
        : ''
    }

    <a href="${params.orderUrl}" class="button">Ver Detalhes do Pedido</a>
  `;

  return getEmailLayout(content);
}

interface OrderDeliveredParams {
  userName: string;
  orderNumber: string;
  deliveryDate: Date;
  orderUrl: string;
}

export function orderDeliveredEmail(params: OrderDeliveredParams): string {
  const content = `
    <h2>Pedido Entregue! ✅</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      Seu pedido <strong>${params.orderNumber}</strong> foi entregue com sucesso!
    </p>

    <div class="info-box">
      <strong>Data de Entrega:</strong> ${formatDate(params.deliveryDate)}
    </div>

    <p style="margin-top: 24px;">
      Esperamos que você esteja satisfeito(a) com sua compra.
      Sua opinião é muito importante para nós e ajuda outros clientes a fazerem boas escolhas.
    </p>

    <a href="${params.orderUrl}" class="button">Avaliar Produtos</a>

    <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
      Caso haja algum problema com seu pedido, entre em contato conosco em até 7 dias após a entrega.
    </p>
  `;

  return getEmailLayout(content);
}
