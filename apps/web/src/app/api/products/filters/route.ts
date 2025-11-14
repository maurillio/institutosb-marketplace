import { NextResponse } from 'next/server';
import { prisma } from '@thebeautypro/database';

// GET /api/products/filters - Obter opções de filtros disponíveis
export async function GET(request: Request) {
  try {
    // Buscar todos os produtos ativos
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: {
        brand: true,
        skinTypes: true,
        concerns: true,
        tags: true,
      },
    });

    // Extrair valores únicos
    const brands = new Set<string>();
    const skinTypes = new Set<string>();
    const concerns = new Set<string>();
    const tags = new Set<string>();

    products.forEach((product) => {
      if (product.brand) brands.add(product.brand);
      product.skinTypes.forEach((type) => skinTypes.add(type));
      product.concerns.forEach((concern) => concerns.add(concern));
      product.tags.forEach((tag) => tags.add(tag));
    });

    // Mapear para português e organizar
    const skinTypeLabels: Record<string, string> = {
      oleosa: 'Oleosa',
      seca: 'Seca',
      mista: 'Mista',
      normal: 'Normal',
      sensivel: 'Sensível',
    };

    const concernLabels: Record<string, string> = {
      acne: 'Acne',
      envelhecimento: 'Envelhecimento',
      hidratacao: 'Hidratação',
      manchas: 'Manchas',
      rugas: 'Rugas',
      poros: 'Poros Dilatados',
      olheiras: 'Olheiras',
      flacidez: 'Flacidez',
    };

    const tagLabels: Record<string, string> = {
      vegano: 'Vegano',
      'cruelty-free': 'Cruelty-Free',
      organico: 'Orgânico',
      natural: 'Natural',
      'sem-parabenos': 'Sem Parabenos',
      'sem-fragrancia': 'Sem Fragrância',
      'hipoalergenico': 'Hipoalergênico',
      dermatologicamente: 'Dermatologicamente Testado',
    };

    return NextResponse.json({
      brands: Array.from(brands).sort(),
      skinTypes: Array.from(skinTypes).map((type) => ({
        value: type,
        label: skinTypeLabels[type] || type,
      })),
      concerns: Array.from(concerns).map((concern) => ({
        value: concern,
        label: concernLabels[concern] || concern,
      })),
      tags: Array.from(tags).map((tag) => ({
        value: tag,
        label: tagLabels[tag] || tag,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar filtros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar filtros' },
      { status: 500 }
    );
  }
}
