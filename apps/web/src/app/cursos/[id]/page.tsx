'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import Image from 'next/image';
import { Clock, Users, Star, Play, CheckCircle } from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`);
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!session) {
      router.push('/entrar?redirect=/cursos/' + params.id);
      return;
    }

    setEnrolling(true);
    try {
      const response = await fetch(`/api/courses/${params.id}/enroll`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Erro ao matricular');

      alert('Matrícula realizada com sucesso!');
      router.push('/meus-cursos');
    } catch (error: any) {
      alert(error.message || 'Erro ao matricular');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
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

  if (!course) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
          <Image
            src={course.thumbnail || '/placeholder.png'}
            alt={course.title}
            fill
            className="object-cover opacity-60"
          />
          <div className="container relative h-full flex items-center">
            <div className="max-w-2xl text-white">
              <p className="text-sm">
                {course.type === 'ONLINE' ? 'Curso Online' :
                 course.type === 'IN_PERSON' ? 'Curso Presencial' :
                 'Curso Híbrido'}
              </p>
              <h1 className="mt-2 text-4xl font-bold">{course.title}</h1>
              <p className="mt-4 text-lg">{course.description}</p>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{course.avgRating}</span>
                  <span className="text-sm">({course._count.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course._count.enrollments} alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.totalDuration}h total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Módulos */}
              <div className="rounded-lg border bg-white p-6">
                <h2 className="text-xl font-bold">Conteúdo do Curso</h2>
                <p className="text-sm text-muted-foreground">
                  {course.modules.length} módulos • {course.totalLessons} aulas
                </p>

                <div className="mt-6 space-y-4">
                  {course.modules.map((module: any) => (
                    <div key={module.id} className="border-b pb-4 last:border-0">
                      <h3 className="font-semibold">{module.title}</h3>
                      <div className="mt-2 space-y-2">
                        {module.lessons.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Play className="h-4 w-4 text-muted-foreground" />
                              <span>{lesson.title}</span>
                              {lesson.isFree && (
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                  Grátis
                                </span>
                              )}
                            </div>
                            <span className="text-muted-foreground">
                              {lesson.duration}min
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instrutor */}
              <div className="mt-6 rounded-lg border bg-white p-6">
                <h2 className="text-xl font-bold">Instrutor</h2>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                    {course.instructor.avatar && (
                      <Image
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{course.instructor.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>⭐ {course.instructor.instructorProfile?.rating?.toFixed(1) || '0.0'}</span>
                      <span>• {course.instructor.instructorProfile?.totalStudents || 0} alunos</span>
                    </div>
                  </div>
                </div>
                {course.instructor.instructorProfile?.bio && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {course.instructor.instructorProfile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 rounded-lg border bg-white p-6">
                <p className="text-3xl font-bold text-primary">
                  R$ {course.price.toFixed(2)}
                </p>

                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Processando...' : 'Matricular-se agora'}
                </Button>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Acesso vitalício</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Certificado de conclusão</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{course.totalLessons} aulas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Suporte do instrutor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
