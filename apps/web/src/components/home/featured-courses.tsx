import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';
import { Star, Users, Clock } from 'lucide-react';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { prisma } from '@thebeautypro/database';

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export async function FeaturedCourses() {
  // Busca 6 cursos reais do banco - os mais bem avaliados e publicados
  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: [
      { rating: 'desc' },
      { totalEnrollments: 'desc' },
    ],
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      rating: true,
      thumbnail: true,
      duration: true,
      totalEnrollments: true,
      instructor: {
        select: {
          name: true,
        },
      },
    },
  });
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
                    src={course.thumbnail || PLACEHOLDER_IMAGE}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.instructor.name}
                  </p>

                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.totalEnrollments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration ? formatDuration(course.duration) : '0h'}</span>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-primary">
                    R$ {Number(course.price).toFixed(2)}
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
