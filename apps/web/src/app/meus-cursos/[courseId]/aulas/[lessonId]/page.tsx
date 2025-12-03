'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  completed: boolean;
  module: {
    id: string;
    title: string;
    courseId: string;
  };
}

interface Navigation {
  previous: {
    lessonId: string;
    title: string;
  } | null;
  next: {
    lessonId: string;
    title: string;
  } | null;
}

export default function LessonPlayerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [hasWatchedMost, setHasWatchedMost] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(
        '/entrar?redirect=/meus-cursos/' +
          params.courseId +
          '/aulas/' +
          params.lessonId
      );
    } else if (status === 'authenticated') {
      fetchLesson();
    }
  }, [status, params.lessonId, router]);

  const fetchLesson = async () => {
    try {
      // Buscar dados da aula
      const [lessonRes, courseRes] = await Promise.all([
        fetch(`/api/lessons/${params.lessonId}/progress`),
        fetch(`/api/my-courses/${params.courseId}`),
      ]);

      if (!lessonRes.ok || !courseRes.ok) {
        throw new Error('Erro ao carregar aula');
      }

      const [progressData, courseData] = await Promise.all([
        lessonRes.json(),
        courseRes.json(),
      ]);

      // Encontrar a aula atual no curso
      let currentLesson: any = null;
      let currentModuleIndex = -1;
      let currentLessonIndex = -1;

      for (let i = 0; i < courseData.modules.length; i++) {
        const module = courseData.modules[i];
        for (let j = 0; j < module.lessons.length; j++) {
          if (module.lessons[j].id === params.lessonId) {
            currentLesson = module.lessons[j];
            currentLesson.module = {
              id: module.id,
              title: module.title,
              courseId: courseData.id,
            };
            currentModuleIndex = i;
            currentLessonIndex = j;
            break;
          }
        }
        if (currentLesson) break;
      }

      if (!currentLesson) {
        throw new Error('Aula não encontrada');
      }

      setLesson(currentLesson);

      // Determinar navegação (próxima e anterior)
      let prevLesson = null;
      let nextLesson = null;

      // Aula anterior
      if (currentLessonIndex > 0) {
        const prev =
          courseData.modules[currentModuleIndex].lessons[currentLessonIndex - 1];
        prevLesson = { lessonId: prev.id, title: prev.title };
      } else if (currentModuleIndex > 0) {
        const prevModule = courseData.modules[currentModuleIndex - 1];
        const lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
        prevLesson = { lessonId: lastLesson.id, title: lastLesson.title };
      }

      // Próxima aula
      if (
        currentLessonIndex <
        courseData.modules[currentModuleIndex].lessons.length - 1
      ) {
        const next =
          courseData.modules[currentModuleIndex].lessons[currentLessonIndex + 1];
        nextLesson = { lessonId: next.id, title: next.title };
      } else if (currentModuleIndex < courseData.modules.length - 1) {
        const nextModule = courseData.modules[currentModuleIndex + 1];
        if (nextModule.lessons.length > 0) {
          const firstLesson = nextModule.lessons[0];
          nextLesson = { lessonId: firstLesson.id, title: firstLesson.title };
        }
      }

      setNavigation({ previous: prevLesson, next: nextLesson });
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar aula');
      router.push('/meus-cursos/' + params.courseId);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!lesson || lesson.completed) return;

    setMarkingComplete(true);
    try {
      const response = await fetch(`/api/lessons/${params.lessonId}/progress`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Erro');

      const data = await response.json();

      toast.success(data.message || 'Aula marcada como concluída!');

      // Atualizar estado local
      setLesson((prev) => (prev ? { ...prev, completed: true } : null));

      // Se concluiu o curso, mostrar mensagem especial
      if (data.enrollment?.progress === 100) {
        toast.success('🎉 Parabéns! Você concluiu o curso!', {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao marcar aula como concluída');
    } finally {
      setMarkingComplete(false);
    }
  };

  // Tracking de progresso do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;

      // Se assistiu 80% ou mais, considerar "assistido"
      if (progress >= 80 && !hasWatchedMost) {
        setHasWatchedMost(true);
      }
    };

    const handleEnded = () => {
      // Marcar automaticamente como concluída quando terminar
      if (!lesson?.completed) {
        handleMarkComplete();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [lesson, hasWatchedMost]);

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p>Carregando aula...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Video Player */}
        <div className="bg-black">
          <div className="container">
            <div className="relative aspect-video w-full">
              {lesson.videoUrl ? (
                // Se for URL do YouTube/Vimeo, usar iframe
                lesson.videoUrl.includes('youtube.com') ||
                lesson.videoUrl.includes('youtu.be') ||
                lesson.videoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={lesson.videoUrl.replace('watch?v=', 'embed/')}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  // Vídeo hospedado próprio
                  <video
                    ref={videoRef}
                    className="h-full w-full"
                    controls
                    controlsList="nodownload"
                  >
                    <source src={lesson.videoUrl} type="video/mp4" />
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white">
                  <div className="text-center">
                    <FileText className="mx-auto h-20 w-20 opacity-50" />
                    <p className="mt-4">Vídeo não disponível</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Info */}
        <div className="border-b bg-white">
          <div className="container py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{lesson.title}</h1>
                  {lesson.completed && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Concluída
                    </span>
                  )}
                </div>
                <p className="mt-2 text-muted-foreground">{lesson.module.title}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.duration} minutos
                  </span>
                </div>
              </div>

              {!lesson.completed && (
                <Button
                  onClick={handleMarkComplete}
                  disabled={markingComplete}
                  size="lg"
                >
                  {markingComplete ? (
                    'Marcando...'
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Marcar como Concluída
                    </>
                  )}
                </Button>
              )}
            </div>

            {lesson.description && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold">Sobre esta aula</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {lesson.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b bg-white">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div>
                {navigation?.previous ? (
                  <Button
                    asChild
                    variant="outline"
                  >
                    <Link
                      href={`/meus-cursos/${params.courseId}/aulas/${navigation.previous.lessonId}`}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Aula Anterior
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}
              </div>

              <Button
                asChild
                variant="outline"
              >
                <Link href={`/meus-cursos/${params.courseId}`}>
                  Ver Todas as Aulas
                </Link>
              </Button>

              <div>
                {navigation?.next ? (
                  <Button asChild>
                    <Link
                      href={`/meus-cursos/${params.courseId}/aulas/${navigation.next.lessonId}`}
                    >
                      Próxima Aula
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Auto-advance suggestion */}
        {lesson.completed && navigation?.next && (
          <div className="bg-primary/10">
            <div className="container py-6">
              <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-white p-6">
                <div>
                  <h3 className="font-bold text-primary">Próxima aula</h3>
                  <p className="mt-1 text-sm">{navigation.next.title}</p>
                </div>
                <Button
                  asChild
                  size="lg"
                >
                  <Link
                    href={`/meus-cursos/${params.courseId}/aulas/${navigation.next.lessonId}`}
                  >
                    Continuar
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
