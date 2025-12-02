import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';
import { NotificationService } from '@/lib/notifications';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar role ADMIN
    const roles = session.user.roles || [];
    if (!roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente administradores.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status: newStatus, reason } = body;

    // Validar status permitidos
    const validStatuses = ['DRAFT', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'SOLD'];
    if (newStatus && !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        seller: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Validações específicas por ação
    if (newStatus === 'ACTIVE') {
      // Aprovar produto: validar se tem imagens e descrição
      if (!product.images || product.images.length === 0) {
        return NextResponse.json(
          { error: 'Produto precisa ter pelo menos uma imagem para ser aprovado' },
          { status: 400 }
        );
      }

      if (!product.description || product.description.length < 50) {
        return NextResponse.json(
          { error: 'Produto precisa ter uma descrição com pelo menos 50 caracteres' },
          { status: 400 }
        );
      }
    }

    // Atualizar produto
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        // Se houver razão de reprovação, poderia salvar em um campo notes
      },
      select: {
        id: true,
        name: true,
        status: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Enviar notificação ao vendedor
    try {
      if (newStatus === 'ACTIVE' && product.status !== 'ACTIVE') {
        // Produto aprovado
        await NotificationService.notifyProductApproved(
          product.sellerId,
          product.name,
          product.id
        );
      } else if (newStatus === 'INACTIVE' && reason) {
        // Produto reprovado com motivo
        await NotificationService.notifyProductRejected(
          product.sellerId,
          product.name,
          product.id,
          reason
        );
      }
    } catch (notificationError) {
      // Log do erro mas não bloqueia a operação principal
      console.error('[Admin Products API] Erro ao enviar notificação:', notificationError);
    }

    const statusMessages: Record<string, string> = {
      ACTIVE: 'Produto aprovado com sucesso',
      INACTIVE: 'Produto desativado com sucesso',
      DRAFT: 'Produto movido para rascunho',
    };

    return NextResponse.json({
      message: statusMessages[newStatus] || 'Produto atualizado com sucesso',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('[Admin Products API] Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar role ADMIN
    const roles = session.user.roles || [];
    if (!roles.includes('ADMIN')) {
      return NextResponse.json(
        { error: 'Acesso negado. Somente administradores.' },
        { status: 403 }
      );
    }

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Validação: não permitir deletar se houver pedidos
    if (product._count.orderItems > 0) {
      return NextResponse.json(
        {
          error: 'Não é possível deletar produto com pedidos. Desative o produto ao invés de deletar.'
        },
        { status: 400 }
      );
    }

    // Deletar produto (hard delete)
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Produto deletado com sucesso',
    });
  } catch (error) {
    console.error('[Admin Products API] Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    );
  }
}
