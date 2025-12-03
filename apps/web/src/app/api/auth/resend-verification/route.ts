import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import crypto from 'crypto';
import { EmailService } from '@/lib/email/email-service';
import { authOptions } from '../[...nextauth]/route';

// POST /api/auth/resend-verification - Reenviar email de verificação
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Você precisa estar autenticado' },
        { status: 401 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Já verificado
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email já verificado', alreadyVerified: true },
        { status: 200 }
      );
    }

    // Gerar novo token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Atualizar usuário com novo token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpiry,
      },
    });

    // Enviar email
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verificar-email?token=${emailVerificationToken}`;

    try {
      await EmailService.sendEmailVerification(user.email, user.name || '', verificationUrl);
    } catch (emailError) {
      console.error('Erro ao enviar email de verificação:', emailError);
      return NextResponse.json(
        { error: 'Erro ao enviar email. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Email de verificação reenviado com sucesso!',
      success: true,
    });
  } catch (error) {
    console.error('Erro ao reenviar verificação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
