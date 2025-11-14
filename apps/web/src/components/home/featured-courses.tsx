import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';
import { Star, Users, Clock } from 'lucide-react';

// Mock data - será substituído por dados reais do banco
const courses = [
  {
    id: '1',
    title: 'Curso Completo de Maquiagem Profissional',
    price: 299.0,
    image: 'https://via.placeholder.com/400x225',
    rating: 4.9,
    students: 1234,
    duration: 1200, // minutos
    instructor: 'João Santos',
    slug: 'curso-completo-maquiagem-profissional',
  },
  {
    id: '2',
    title: 'Técnicas Avançadas de Colorimetria Capilar',
    price: 399.0,
    image: 'https://via.placeholder.com/400x225',
    rating: 5.0,
    students: 856,
    duration: 900,
    instructor: 'Maria Silva',
    slug: 'tecnicas-avancadas-colorimetria',
  },
  {
    id: '3',
    title: 'Skincare do Básico ao Avançado',
    price: 249.0,
    image: 'https://via.placeholder.com/400x225',
    rating: 4.8,
    students: 2341,
    duration: 800,
    instructor: 'Ana Costa',
    slug: 'skincare-basico-avancado',
  },
];

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export function FeaturedCourses() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Cursos Populares</h2>
          <Button variant="outline" asChild>
            <Link href="/cursos">Ver todos</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/cursos/${course.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.instructor}
                  </p>

                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-primary">
                    R$ {course.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
