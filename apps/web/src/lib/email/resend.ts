import { Resend } from 'resend';

// Inicializar Resend com API key
// API key deve estar em RESEND_API_KEY no .env
// Se não houver API key, os emails não serão enviados (mas não causará erros)
const apiKey = process.env.RESEND_API_KEY || 'placeholder_key';
export const resend = new Resend(apiKey);

// Flag para verificar se o email está configurado
export const isEmailConfigured = !!process.env.RESEND_API_KEY;

// Configurações padrão
export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'The Beauty Pro <noreply@thebeautypro.com>',
  replyTo: process.env.RESEND_REPLY_TO || 'contato@thebeautypro.com',
};

// Tipos de email
export type EmailType =
  | 'order_confirmation'
  | 'order_status_update'
  | 'order_shipped'
  | 'order_delivered'
  | 'payment_confirmed'
  | 'payment_failed'
  | 'product_approved'
  | 'product_rejected'
  | 'course_approved'
  | 'course_rejected'
  | 'enrollment_confirmation'
  | 'course_completed'
  | 'certificate_ready'
  | 'payout_processed'
  | 'welcome'
  | 'password_reset';

// Interface para envio de email
export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// Função auxiliar para enviar email
export async function sendEmail(params: SendEmailParams) {
  // Se email não estiver configurado, apenas logar e retornar sucesso
  if (!isEmailConfigured) {
    console.log('[Email] Email não configurado (RESEND_API_KEY ausente). Email que seria enviado:', {
      to: params.to,
      subject: params.subject,
    });
    return { success: false, error: 'Email not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo || EMAIL_CONFIG.replyTo,
    });

    console.log('[Email] Enviado com sucesso:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[Email] Erro ao enviar:', error);
    return { success: false, error };
  }
}
