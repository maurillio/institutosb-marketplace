import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(request: Request) {
  try {
    console.log('[Profile API] ========== INÍCIO PATCH ==========');
    
    const session = await getServerSession(authOptions);
    console.log('[Profile API] Session:', session ? `User ID: ${session.user?.id}` : 'Não autenticado');

    if (!session?.user?.id) {
      console.error('[Profile API] ❌ Não autenticado');
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    console.log('[Profile API] Dados recebidos:', {
      name: body.name,
      phone: body.phone,
      avatar: body.avatar?.substring(0, 50) + '...',
      cpfCnpj: body.cpfCnpj,
    });
    
    const { name, phone, avatar, cpfCnpj } = body;

    // Validar campos obrigatórios
    if (!name || !name.trim()) {
      console.error('[Profile API] ❌ Nome é obrigatório');
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    console.log('[Profile API] Atualizando usuário:', session.user.id);
    
    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        phone: phone || null,
        avatar: avatar || null,
        cpfCnpj: cpfCnpj || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        cpfCnpj: true,
        roles: true,
      },
    });

    console.log('[Profile API] ✅ Usuário atualizado:', {
      id: updatedUser.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar?.substring(0, 50) + '...',
    });

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser,
    });
  } catch (error) {
    console.error('[Profile API] ❌ ERRO CRÍTICO:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        cpfCnpj: true,
        roles: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    );
  }
}
