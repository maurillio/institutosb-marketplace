import Link from 'next/link';
import { Sparkles, Scissors, Heart, Paintbrush, Package } from 'lucide-react';
import { prisma } from '@thebeautypro/database';

// Mapeamento de ícones e cores por slug
const iconMap: Record<string, any> = {
  maquiagem: Paintbrush,
  cabelo: Scissors,
  skincare: Heart,
  unhas: Sparkles,
  equipamentos: Package,
};

const colorMap: Record<string, string> = {
  maquiagem: 'text-pink-500',
  cabelo: 'text-purple-500',
  skincare: 'text-rose-500',
  unhas: 'text-blue-500',
  equipamentos: 'text-orange-500',
};

export async function Categories() {
  // Busca categorias principais (sem parent) do banco
  const categoriesFromDb = await prisma.category.findMany({
    where: {
      parentId: null,
      isActive: true,
    },
    orderBy: {
      order: 'asc',
    },
    select: {
      name: true,
      slug: true,
    },
  });

  const categories = categoriesFromDb.map((cat) => ({
    ...cat,
    icon: iconMap[cat.slug] || Package,
    color: colorMap[cat.slug] || 'text-gray-500',
  }));
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Explore por Categoria
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className="group relative overflow-hidden rounded-lg border bg-card p-8 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`${category.color} rounded-full bg-muted p-4 group-hover:scale-110 transition-transform`}
                >
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
