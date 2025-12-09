import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { role } = await request.json();

    // Validar role
    const allowedUpgrades = ['SELLER', 'INSTRUCTOR'];
    if (!allowedUpgrades.includes(role)) {
      return NextResponse.json(
        { error: 'Role inválido. Apenas SELLER ou INSTRUCTOR são permitidos.' },
        { status: 400 }
      );
    }

    // Buscar usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Adicionar novo role aos roles existentes
    const currentRoles = currentUser.roles || [];

    // Evitar duplicatas
    if (currentRoles.includes(role)) {
      return NextResponse.json({
        message: 'Você já possui este role',
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          roles: currentRoles,
        },
      });
    }

    const newRoles = [...currentRoles, role];

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { roles: newRoles },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });

    // Se for SELLER, criar SellerProfile
    if (role === 'SELLER') {
      const existingSellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!existingSellerProfile) {
        // Gerar slug único para a loja
        const baseSlug = currentUser.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const uniqueSlug = `${baseSlug}-${session.user.id.substring(0, 8)}`;

        await prisma.sellerProfile.create({
          data: {
            userId: session.user.id,
            storeName: `${currentUser.name}'s Store`,
            storeSlug: uniqueSlug,
            description: 'Minha loja online de produtos de beleza',
          },
        });
      }
    }

    // Se for INSTRUCTOR, criar InstructorProfile
    if (role === 'INSTRUCTOR') {
      const existingInstructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!existingInstructorProfile) {
        await prisma.instructorProfile.create({
          data: {
            userId: session.user.id,
            bio: 'Instrutor de beleza',
          },
        });
      }
    }

    return NextResponse.json({
      message: `Agora você é um ${role === 'SELLER' ? 'Vendedor' : 'Instrutor'}!`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erro ao fazer upgrade de role:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
