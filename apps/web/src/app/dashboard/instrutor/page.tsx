'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';
import { GraduationCap, Users, DollarSign, Star, Plus } from 'lucide-react';

export default function InstructorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    } else if (status === 'authenticated') {
      if (!session.user.roles.includes('INSTRUCTOR') && !session.user.roles.includes('ADMIN')) {
        router.push('/');
      } else {
        fetchCourses();
      }
    }
  }, [status, session, router]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/instructor/courses');
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

  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0);
  const totalRevenue = courses.reduce(
    (sum, c) => sum + (c.price * c._count.enrollments),
    0
  );
  const avgRating = courses.length > 0
    ? courses.reduce((sum, c) => sum + (c._count.reviews || 0), 0) / courses.length
    : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard do Instrutor</h1>
              <p className="text-muted-foreground">Gerencie seus cursos</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/instrutor/cursos/novo">
                <Plus className="mr-2 h-4 w-4" />
                Novo Curso
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Cursos</p>
                  <p className="mt-2 text-2xl font-bold">{courses.length}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Alunos</p>
                  <p className="mt-2 text-2xl font-bold">{totalStudents}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="mt-2 text-2xl font-bold">
                    R$ {totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avaliação Média</p>
                  <p className="mt-2 text-2xl font-bold">{avgRating.toFixed(1)}</p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="mt-8 rounded-lg border bg-white">
            <div className="border-b p-6">
              <h2 className="text-xl font-bold">Meus Cursos</h2>
            </div>

            {courses.length === 0 ? (
              <div className="flex flex-col items-center p-12">
                <GraduationCap className="h-20 w-20 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhum curso cadastrado</h3>
                <Button asChild className="mt-6">
                  <Link href="/dashboard/instrutor/cursos/novo">Criar Curso</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {courses.map((course) => (
                  <div key={course.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.category.name} • {course.type}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span>{course._count.enrollments} alunos</span>
                          <span>•</span>
                          <span>{course.modules.length} módulos</span>
                          <span>•</span>
                          <span className={`font-semibold ${
                            course.status === 'PUBLISHED'
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}>
                            {course.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          R$ {course.price.toFixed(2)}
                        </p>
                        <Button size="sm" variant="outline" asChild className="mt-2">
                          <Link href={`/cursos/${course.id}`}>Ver Curso</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
