import Link from 'next/link';
import { Sparkles, Scissors, Heart, Paintbrush } from 'lucide-react';

const categories = [
  {
    name: 'Maquiagem',
    slug: 'maquiagem',
    icon: Paintbrush,
    color: 'text-pink-500',
  },
  {
    name: 'Cabelo',
    slug: 'cabelo',
    icon: Scissors,
    color: 'text-purple-500',
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    icon: Heart,
    color: 'text-rose-500',
  },
  {
    name: 'Unhas',
    slug: 'unhas',
    icon: Sparkles,
    color: 'text-blue-500',
  },
];

export function Categories() {
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
