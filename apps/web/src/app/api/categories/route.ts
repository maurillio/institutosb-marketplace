import { NextResponse } from 'next/server';
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
    const body = await request.json();
    const { name, slug, description, imageUrl, parentId } = body;

    // TODO: Adicionar validação de autenticação/autorização (apenas ADMIN)

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
