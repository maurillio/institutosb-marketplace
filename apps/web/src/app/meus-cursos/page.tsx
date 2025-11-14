'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@thebeautypro/ui/button';
import { GraduationCap, PlayCircle } from 'lucide-react';

export default function MyCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/meus-cursos');
    } else if (status === 'authenticated') {
      fetchMyCourses();
    }
  }, [status, router]);

  const fetchMyCourses = async () => {
    try {
      const response = await fetch('/api/my-courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Meus Cursos</h1>
          <p className="text-muted-foreground">Continue aprendendo</p>

          {courses.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-lg border bg-white p-12">
              <GraduationCap className="h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">
                Você ainda não está matriculado em nenhum curso
              </h2>
              <Button asChild className="mt-6">
                <Link href="/cursos">Explorar Cursos</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="overflow-hidden rounded-lg border bg-white"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={enrollment.course.imageUrl || 'https://via.placeholder.com/400x225'}
                      alt={enrollment.course.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">
                      {enrollment.course.category.name}
                    </p>
                    <h3 className="mt-1 font-bold line-clamp-2">
                      {enrollment.course.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Por {enrollment.course.instructor.user.name}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold">{enrollment.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {enrollment.completedLessons} de {enrollment.totalLessons} aulas
                      </p>
                    </div>

                    <Button asChild className="mt-4 w-full" variant="outline">
                      <Link href={`/cursos/${enrollment.courseId}`}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continuar Assistindo
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
