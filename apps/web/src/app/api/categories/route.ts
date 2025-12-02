import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@thebeautypro/database';

// GET /api/categories - Listar todas as categorias
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all'); // Se passar ?all=true, retorna todas sem filtro
    
    if (all === 'true') {
      // Retorna todas as categorias para uso em selects
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
        },
      });
      return NextResponse.json(categories);
    }

    const parentId = searchParams.get('parentId');

    const categories = await prisma.category.findMany({
      where: parentId
        ? { parentId }
        : { parentId: null }, // Se não passar parentId, retorna apenas categorias raiz
      include: {
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Criar nova categoria (apenas ADMIN)
export async function POST(request: Request) {
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
        { error: 'Acesso negado. Somente administradores podem criar categorias.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, imageUrl, parentId } = body;

    // Validações básicas
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este slug' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        parentId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}
