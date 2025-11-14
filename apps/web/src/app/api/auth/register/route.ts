import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Valida os dados
    const validatedData = registerSchema.parse(body);

    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        roles: ['CUSTOMER'], // Papel padrão
        status: 'ACTIVE', // Ativado automaticamente (pode mudar para PENDING_VERIFICATION)
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso!',
      user,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    );
  }
}
