import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';
import bcrypt from 'bcryptjs';

// POST /api/auth/reset-password - Redefinir senha com token
export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    // Verificar se o token não expirou
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      // Limpar token expirado
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return NextResponse.json(
        { error: 'Token expirado. Solicite um novo link de recuperação.' },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar senha e limpar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        // Atualizar data de última atualização
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Senha redefinida com sucesso! Você já pode fazer login.',
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    );
  }
}
