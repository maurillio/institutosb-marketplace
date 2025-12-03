import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// POST /api/auth/verify-email - Verificar email com token
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    // Verificar se o token não expirou
    if (!user.emailVerificationExpiry || user.emailVerificationExpiry < new Date()) {
      // Limpar token expirado
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: null,
          emailVerificationExpiry: null,
        },
      });

      return NextResponse.json(
        { error: 'Token expirado. Solicite um novo email de verificação.' },
        { status: 400 }
      );
    }

    // Email já verificado
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email já verificado anteriormente',
        alreadyVerified: true,
      });
    }

    // Marcar email como verificado e ativar conta
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpiry: null,
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Email verificado com sucesso! Sua conta está ativa.',
      success: true,
    });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar email' },
      { status: 500 }
    );
  }
}
