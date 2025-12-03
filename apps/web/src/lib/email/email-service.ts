import { sendEmail } from './resend';
import {
  orderConfirmationEmail,
  orderStatusUpdateEmail,
  orderDeliveredEmail,
} from './templates/order-templates';
import {
  productApprovedEmail,
  productRejectedEmail,
  courseApprovedEmail,
  courseRejectedEmail,
  enrollmentConfirmationEmail,
  courseCompletedEmail,
} from './templates/product-course-templates';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebeautypro.vercel.app';

export class EmailService {
  // Pedido confirmado
  static async sendOrderConfirmation(params: {
    to: string;
    userName: string;
    orderNumber: string;
    orderDate: Date;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    shippingCost: number;
    discount?: number;
    total: number;
    orderId: string;
  }) {
    const html = orderConfirmationEmail({
      ...params,
      orderUrl: `${SITE_URL}/meus-pedidos/${params.orderId}`,
    });

    return sendEmail({
      to: params.to,
      subject: `Pedido Confirmado - ${params.orderNumber}`,
      html,
    });
  }

  // Atualização de status do pedido
  static async sendOrderStatusUpdate(params: {
    to: string;
    userName: string;
    orderNumber: string;
    oldStatus: string;
    newStatus: string;
    statusMessage: string;
    orderId: string;
    trackingCode?: string;
    carrier?: string;
  }) {
    const html = orderStatusUpdateEmail({
      ...params,
      orderUrl: `${SITE_URL}/meus-pedidos/${params.orderId}`,
    });

    const statusLabels: Record<string, string> = {
      PENDING: 'Pendente',
      PROCESSING: 'Em Processamento',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
    };

    const statusLabel = statusLabels[params.newStatus] || params.newStatus;

    return sendEmail({
      to: params.to,
      subject: `Atualização do Pedido ${params.orderNumber} - ${statusLabel}`,
      html,
    });
  }

  // Pedido entregue
  static async sendOrderDelivered(params: {
    to: string;
    userName: string;
    orderNumber: string;
    deliveryDate: Date;
    orderId: string;
  }) {
    const html = orderDeliveredEmail({
      ...params,
      orderUrl: `${SITE_URL}/meus-pedidos/${params.orderId}`,
    });

    return sendEmail({
      to: params.to,
      subject: `Pedido Entregue - ${params.orderNumber}`,
      html,
    });
  }

  // Produto aprovado
  static async sendProductApproved(params: {
    to: string;
    userName: string;
    productName: string;
    productId: string;
  }) {
    const html = productApprovedEmail({
      ...params,
      productUrl: `${SITE_URL}/produtos/${params.productId}`,
      dashboardUrl: `${SITE_URL}/dashboard/vendedor/produtos`,
    });

    return sendEmail({
      to: params.to,
      subject: `Produto Aprovado - ${params.productName}`,
      html,
    });
  }

  // Produto reprovado
  static async sendProductRejected(params: {
    to: string;
    userName: string;
    productName: string;
    reason: string;
  }) {
    const html = productRejectedEmail({
      ...params,
      dashboardUrl: `${SITE_URL}/dashboard/vendedor/produtos`,
    });

    return sendEmail({
      to: params.to,
      subject: `Produto Precisa de Ajustes - ${params.productName}`,
      html,
    });
  }

  // Curso aprovado
  static async sendCourseApproved(params: {
    to: string;
    userName: string;
    courseTitle: string;
    courseId: string;
  }) {
    const html = courseApprovedEmail({
      ...params,
      courseUrl: `${SITE_URL}/cursos/${params.courseId}`,
      dashboardUrl: `${SITE_URL}/dashboard/instrutor`,
    });

    return sendEmail({
      to: params.to,
      subject: `Curso Aprovado - ${params.courseTitle}`,
      html,
    });
  }

  // Curso reprovado
  static async sendCourseRejected(params: {
    to: string;
    userName: string;
    courseTitle: string;
    reason: string;
  }) {
    const html = courseRejectedEmail({
      ...params,
      dashboardUrl: `${SITE_URL}/dashboard/instrutor`,
    });

    return sendEmail({
      to: params.to,
      subject: `Curso Precisa de Ajustes - ${params.courseTitle}`,
      html,
    });
  }

  // Matrícula confirmada
  static async sendEnrollmentConfirmation(params: {
    to: string;
    userName: string;
    courseTitle: string;
    courseId: string;
    instructorName: string;
  }) {
    const html = enrollmentConfirmationEmail({
      ...params,
      courseUrl: `${SITE_URL}/meus-cursos/${params.courseId}`,
    });

    return sendEmail({
      to: params.to,
      subject: `Matrícula Confirmada - ${params.courseTitle}`,
      html,
    });
  }

  // Curso concluído
  static async sendCourseCompleted(params: {
    to: string;
    userName: string;
    courseTitle: string;
    completionDate: Date;
    courseId: string;
  }) {
    const html = courseCompletedEmail({
      ...params,
      certificateUrl: `${SITE_URL}/meus-cursos/${params.courseId}/certificado`,
    });

    return sendEmail({
      to: params.to,
      subject: `Parabéns! Você Concluiu o Curso - ${params.courseTitle}`,
      html,
    });
  }

  // Email de boas-vindas
  static async sendWelcomeEmail(params: { to: string; userName: string }) {
    const html = `
      <h2>Bem-vindo(a) à The Beauty Pro! 🎉</h2>
      <p>Olá <strong>${params.userName}</strong>,</p>
      <p>
        É um prazer ter você conosco! Sua conta foi criada com sucesso e você já pode
        começar a explorar tudo que a plataforma tem a oferecer.
      </p>

      <div class="info-box">
        🛍️ Compre produtos de beleza<br>
        📚 Faça cursos online e presenciais<br>
        💼 Venda seus próprios produtos<br>
        👨‍🏫 Crie e venda seus cursos
      </div>

      <p style="margin-top: 24px;">
        <strong>Próximos passos:</strong>
      </p>
      <ul style="color: #374151; line-height: 1.8;">
        <li>Complete seu perfil para uma experiência personalizada</li>
        <li>Explore nosso catálogo de produtos e cursos</li>
        <li>Configure sua conta de vendedor ou instrutor</li>
      </ul>

      <a href="${SITE_URL}/perfil" class="button">Completar Perfil</a>
      <a href="${SITE_URL}/produtos" class="button" style="background-color: #6b7280; margin-left: 8px;">
        Explorar Produtos
      </a>

      <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
        Se tiver qualquer dúvida, nossa equipe está sempre disponível para ajudar!
      </p>
    `;

    return sendEmail({
      to: params.to,
      subject: 'Bem-vindo(a) à The Beauty Pro! 🎉',
      html: html.trim(),
    });
  }
}
