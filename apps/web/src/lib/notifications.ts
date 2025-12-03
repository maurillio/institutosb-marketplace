import { prisma } from '@thebeautypro/database';
import { EmailService } from './email/email-service';

/**
 * Tipos de notificação disponíveis no sistema
 */
export enum NotificationType {
  ORDER_STATUS_UPDATED = 'ORDER_STATUS_UPDATED',
  PRODUCT_APPROVED = 'PRODUCT_APPROVED',
  PRODUCT_REJECTED = 'PRODUCT_REJECTED',
  COURSE_APPROVED = 'COURSE_APPROVED',
  COURSE_REJECTED = 'COURSE_REJECTED',
  NEW_ENROLLMENT = 'NEW_ENROLLMENT',
  NEW_ORDER = 'NEW_ORDER',
  PAYOUT_APPROVED = 'PAYOUT_APPROVED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}

interface CreateNotificationParams {
  userId: string;
  type: string; // NotificationType do Prisma
  title: string;
  message: string;
  metadata?: any;
}

/**
 * Serviço de notificações
 * Centraliza a criação e envio de notificações no sistema
 */
export class NotificationService {
  /**
   * Cria uma nova notificação para um usuário
   */
  static async create(params: CreateNotificationParams) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: params.userId,
          type: params.type as any,
          title: params.title,
          message: params.message,
          metadata: params.metadata || null,
          isRead: false,
        },
      });

      return notification;
    } catch (error) {
      console.error('[NotificationService] Erro ao criar notificação:', error);
      throw error;
    }
  }

  /**
   * Notifica vendedor sobre aprovação de produto
   */
  static async notifyProductApproved(sellerId: string, productName: string, productId: string) {
    // Criar notificação in-app
    const notification = await this.create({
      userId: sellerId,
      type: 'PRODUCT_APPROVED',
      title: '✅ Produto Aprovado',
      message: `Seu produto "${productName}" foi aprovado e está agora visível na plataforma!`,
      metadata: { productId },
    });

    // Enviar email (não-bloqueante)
    try {
      const user = await prisma.user.findUnique({
        where: { id: sellerId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        EmailService.sendProductApproved({
          to: user.email,
          userName: user.name || 'Vendedor',
          productName,
          productId,
        }).catch(err => console.error('[Email] Erro ao enviar:', err));
      }
    } catch (error) {
      console.error('[NotificationService] Erro ao enviar email:', error);
    }

    return notification;
  }

  /**
   * Notifica vendedor sobre rejeição de produto
   */
  static async notifyProductRejected(sellerId: string, productName: string, productId: string, reason?: string) {
    const message = reason
      ? `Seu produto "${productName}" foi reprovado. Motivo: ${reason}`
      : `Seu produto "${productName}" foi reprovado. Entre em contato com o suporte para mais informações.`;

    // Criar notificação in-app
    const notification = await this.create({
      userId: sellerId,
      type: 'PRODUCT_REJECTED',
      title: '❌ Produto Reprovado',
      message,
      metadata: { productId, reason },
    });

    // Enviar email (não-bloqueante)
    try {
      const user = await prisma.user.findUnique({
        where: { id: sellerId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        EmailService.sendProductRejected({
          to: user.email,
          userName: user.name || 'Vendedor',
          productName,
          reason: reason || 'Entre em contato com o suporte para mais informações.',
        }).catch(err => console.error('[Email] Erro ao enviar:', err));
      }
    } catch (error) {
      console.error('[NotificationService] Erro ao enviar email:', error);
    }

    return notification;
  }

  /**
   * Notifica instrutor sobre aprovação de curso
   */
  static async notifyCourseApproved(instructorId: string, courseTitle: string, courseId: string) {
    // Criar notificação in-app
    const notification = await this.create({
      userId: instructorId,
      type: 'COURSE_APPROVED',
      title: '✅ Curso Publicado',
      message: `Seu curso "${courseTitle}" foi aprovado e publicado na plataforma!`,
      metadata: { courseId },
    });

    // Enviar email (não-bloqueante)
    try {
      const user = await prisma.user.findUnique({
        where: { id: instructorId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        EmailService.sendCourseApproved({
          to: user.email,
          userName: user.name || 'Instrutor',
          courseTitle,
          courseId,
        }).catch(err => console.error('[Email] Erro ao enviar:', err));
      }
    } catch (error) {
      console.error('[NotificationService] Erro ao enviar email:', error);
    }

    return notification;
  }

  /**
   * Notifica instrutor sobre rejeição/arquivamento de curso
   */
  static async notifyCourseRejected(instructorId: string, courseTitle: string, courseId: string, reason?: string) {
    const message = reason
      ? `Seu curso "${courseTitle}" foi arquivado. Motivo: ${reason}`
      : `Seu curso "${courseTitle}" foi arquivado. Entre em contato com o suporte para mais informações.`;

    // Criar notificação in-app
    const notification = await this.create({
      userId: instructorId,
      type: 'COURSE_REJECTED',
      title: '📚 Curso Arquivado',
      message,
      metadata: { courseId, reason },
    });

    // Enviar email (não-bloqueante)
    try {
      const user = await prisma.user.findUnique({
        where: { id: instructorId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        EmailService.sendCourseRejected({
          to: user.email,
          userName: user.name || 'Instrutor',
          courseTitle,
          reason: reason || 'Entre em contato com o suporte para mais informações.',
        }).catch(err => console.error('[Email] Erro ao enviar:', err));
      }
    } catch (error) {
      console.error('[NotificationService] Erro ao enviar email:', error);
    }

    return notification;
  }

  /**
   * Notifica vendedor sobre novo pedido
   */
  static async notifyNewOrder(sellerId: string, orderId: string, orderTotal: number) {
    return this.create({
      userId: sellerId,
      type: 'NEW_ORDER',
      title: '🛍️ Novo Pedido',
      message: `Você recebeu um novo pedido no valor de R$ ${(orderTotal / 100).toFixed(2)}`,
      metadata: { orderId },
    });
  }

  /**
   * Notifica instrutor sobre nova matrícula
   */
  static async notifyNewEnrollment(instructorId: string, courseTitle: string, studentName: string) {
    return this.create({
      userId: instructorId,
      type: 'NEW_ENROLLMENT',
      title: '🎓 Nova Matrícula',
      message: `${studentName} se matriculou no seu curso "${courseTitle}"`,
      metadata: { courseTitle, studentName },
    });
  }

  /**
   * Marca notificação como lida
   */
  static async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Marca todas as notificações de um usuário como lidas
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Busca notificações de um usuário
   */
  static async getUserNotifications(userId: string, limit = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Conta notificações não lidas de um usuário
   */
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}
