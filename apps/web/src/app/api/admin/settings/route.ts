import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// Configurações padrão do sistema
const DEFAULT_SETTINGS = {
  platformFeePercentage: 10, // 10% de taxa da plataforma
  minPayoutAmount: 50, // R$ 50,00 mínimo para saque
  maintenanceMode: false, // Modo de manutenção desativado
  allowNewSellers: true, // Permitir novos vendedores
  allowNewInstructors: true, // Permitir novos instrutores
  requireSellerApproval: true, // Requer aprovação de vendedores
  requireProductApproval: true, // Requer aprovação de produtos
  requireCourseApproval: true, // Requer aprovação de cursos
  maxProductImages: 5, // Máximo de imagens por produto
  maxCourseModules: 20, // Máximo de módulos por curso
  emailNotifications: true, // Notificações por email ativas
  smsNotifications: false, // Notificações por SMS desativadas
};

export async function GET(request: NextRequest) {
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

    // Buscar todas as configurações
    const settings = await prisma.systemSettings.findMany();

    // Criar mapa de configurações
    const settingsMap: Record<string, any> = { ...DEFAULT_SETTINGS };

    // Sobrescrever com valores do banco
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    console.error('[Admin Settings API] Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Chave e valor são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar que a chave existe nas configurações padrão
    if (!(key in DEFAULT_SETTINGS)) {
      return NextResponse.json(
        { error: 'Configuração inválida' },
        { status: 400 }
      );
    }

    // Validações específicas por tipo
    if (key === 'platformFeePercentage') {
      if (typeof value !== 'number' || value < 0 || value > 100) {
        return NextResponse.json(
          { error: 'Taxa da plataforma deve ser entre 0 e 100' },
          { status: 400 }
        );
      }
    }

    if (key === 'minPayoutAmount') {
      if (typeof value !== 'number' || value < 0) {
        return NextResponse.json(
          { error: 'Valor mínimo de saque deve ser positivo' },
          { status: 400 }
        );
      }
    }

    if (key === 'maxProductImages' || key === 'maxCourseModules') {
      if (typeof value !== 'number' || value < 1 || value > 100) {
        return NextResponse.json(
          { error: 'Valor deve ser entre 1 e 100' },
          { status: 400 }
        );
      }
    }

    // Atualizar ou criar configuração
    const setting = await prisma.systemSettings.upsert({
      where: { key },
      update: {
        value,
        updatedBy: session.user.id,
      },
      create: {
        key,
        value,
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Configuração atualizada com sucesso',
      setting: {
        key: setting.key,
        value: setting.value,
      },
    });
  } catch (error) {
    console.error('[Admin Settings API] Erro ao atualizar configuração:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configuração' },
      { status: 500 }
    );
  }
}
