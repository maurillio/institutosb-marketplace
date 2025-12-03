import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';
import crypto from 'crypto';
import { EmailService } from '@/lib/email/email-service';

// POST /api/auth/forgot-password - Solicitar reset de senha
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Por segurança, sempre retornamos sucesso mesmo que o usuário não exista
    // Isso evita que atacantes descubram quais emails estão cadastrados
    if (!user) {
      // Delay para simular processamento (evitar timing attacks)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
      });
    }

    // Gerar token único e seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco de dados
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Enviar email com link de reset
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/redefinir-senha?token=${resetToken}`;

    try {
      await EmailService.sendPasswordResetEmail(user.email, user.name || '', resetUrl);
    } catch (emailError) {
      console.error('Erro ao enviar email de reset:', emailError);
      // Não retornamos erro para o usuário por segurança
      // O token ainda foi criado e pode ser usado se necessário
    }

    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
    });
  } catch (error) {
    console.error('Erro ao processar solicitação de reset:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
