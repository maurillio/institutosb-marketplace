'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  Play,
  CheckCircle,
  Clock,
  Award,
  Download,
  ChevronDown,
  ChevronUp,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

interface LessonWithProgress {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  isFree: boolean;
  completed: boolean;
  progress: any | null;
}

interface ModuleWithProgress {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: LessonWithProgress[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  category: {
    name: string;
  };
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
    instructorProfile: {
      bio: string | null;
      rating: number | null;
    } | null;
  };
  modules: ModuleWithProgress[];
  enrollment: {
    id: string;
    enrolledAt: string;
    progress: number;
    completedAt: string | null;
    certificateUrl: string | null;
    certificateIssuedAt: string | null;
  };
  stats: {
    totalLessons: number;
    completedLessons: number;
    progress: number;
  };
}

export default function MyCourseDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/meus-cursos/' + params.courseId);
    } else if (status === 'authenticated') {
      fetchCourse();
    }
  }, [status, params.courseId, router]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/my-courses/${params.courseId}`);
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('Você não está matriculado neste curso');
          router.push('/cursos/' + params.courseId);
          return;
        }
        throw new Error('Erro');
      }
      const data = await response.json();
      setCourse(data);

      // Expandir primeiro módulo por padrão
      if (data.modules.length > 0) {
        setExpandedModules(new Set([data.modules[0].id]));
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar curso');
      router.push('/meus-cursos');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getNextLesson = () => {
    if (!course) return null;

    // Encontrar primeira aula não completa
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          return { module, lesson };
        }
      }
    }

    // Se todas estão completas, retornar primeira aula
    if (course.modules[0]?.lessons[0]) {
      return {
        module: course.modules[0],
        lesson: course.modules[0].lessons[0],
      };
    }

    return null;
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

  if (!course) return null;

  const nextLesson = getNextLesson();
  const isCompleted = course.enrollment.progress === 100;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Course Header */}
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-primary to-purple-600">
          {course.imageUrl && (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover opacity-20"
            />
          )}
          <div className="container relative h-full flex items-center">
            <div className="max-w-3xl text-white">
              <p className="text-sm opacity-90">{course.category.name}</p>
              <h1 className="mt-2 text-4xl font-bold">{course.title}</h1>
              <p className="mt-2">Por {course.instructor.name}</p>

              {/* Progress */}
              <div className="mt-6 max-w-md">
                <div className="flex items-center justify-between text-sm">
                  <span>Seu Progresso</span>
                  <span className="font-bold">{course.stats.progress}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${course.stats.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-sm opacity-90">
                  {course.stats.completedLessons} de {course.stats.totalLessons}{' '}
                  aulas concluídas
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Certificado */}
              {isCompleted && (
                <div className="mb-6 rounded-lg border border-green-500 bg-green-50 p-6">
                  <div className="flex items-start gap-4">
                    <Award className="h-12 w-12 text-green-600" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900">
                        Parabéns! Você concluiu o curso!
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        Concluído em{' '}
                        {new Date(
                          course.enrollment.completedAt!
                        ).toLocaleDateString('pt-BR')}
                      </p>
                      {course.enrollment.certificateUrl ? (
                        <Button
                          asChild
                          className="mt-4 bg-green-600 hover:bg-green-700"
                        >
                          <a
                            href={course.enrollment.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar Certificado
                          </a>
                        </Button>
                      ) : (
                        <p className="mt-2 text-sm text-green-600">
                          Seu certificado está sendo gerado...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modules & Lessons */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Conteúdo do Curso</h2>

                {course.modules.map((module) => {
                  const isExpanded = expandedModules.has(module.id);
                  const completedCount = module.lessons.filter(
                    (l) => l.completed
                  ).length;

                  return (
                    <div key={module.id} className="rounded-lg border bg-white">
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold">{module.title}</h3>
                          {module.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {module.description}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            {completedCount} de {module.lessons.length} aulas •{' '}
                            {Math.round(
                              (completedCount / module.lessons.length) * 100
                            )}
                            % concluído
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>

                      {/* Lessons */}
                      {isExpanded && (
                        <div className="border-t">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between border-b p-4 last:border-0 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : lesson.isFree ? (
                                  <Play className="h-5 w-5 text-primary" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                )}
                                <div className="flex-1">
                                  <p
                                    className={`font-medium ${
                                      lesson.completed
                                        ? 'text-green-700'
                                        : ''
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {lesson.duration} min
                                    </span>
                                    {lesson.completed &&
                                      lesson.progress?.completedAt && (
                                        <span className="text-green-600">
                                          Concluída em{' '}
                                          {new Date(
                                            lesson.progress.completedAt
                                          ).toLocaleDateString('pt-BR')}
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>

                              <Button
                                asChild
                                size="sm"
                                variant={lesson.completed ? 'outline' : 'default'}
                              >
                                <Link
                                  href={`/meus-cursos/${course.id}/aulas/${lesson.id}`}
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  {lesson.completed ? 'Rever' : 'Assistir'}
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Next Lesson */}
              {nextLesson && !isCompleted && (
                <div className="sticky top-24 rounded-lg border bg-white p-6">
                  <h3 className="font-bold">Próxima Aula</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {nextLesson.module.title}
                  </p>
                  <p className="mt-1 font-medium">{nextLesson.lesson.title}</p>
                  <Button
                    asChild
                    className="mt-4 w-full"
                    size="lg"
                  >
                    <Link
                      href={`/meus-cursos/${course.id}/aulas/${nextLesson.lesson.id}`}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Continuar Assistindo
                    </Link>
                  </Button>
                </div>
              )}

              {/* Instructor */}
              <div className="mt-6 rounded-lg border bg-white p-6">
                <h3 className="font-bold">Instrutor</h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
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
                    <p className="font-medium">{course.instructor.name}</p>
                    {course.instructor.instructorProfile?.rating && (
                      <p className="text-sm text-muted-foreground">
                        ⭐{' '}
                        {course.instructor.instructorProfile.rating.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
                {course.instructor.instructorProfile?.bio && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {course.instructor.instructorProfile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
