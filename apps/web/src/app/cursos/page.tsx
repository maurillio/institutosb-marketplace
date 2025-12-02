'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CourseGridSkeleton } from '@/components/courses/course-card-skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@thebeautypro/ui/button';
import { GraduationCap, Clock, Users, Star, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  thumbnail: string | null;
  type: string;
  level: string;
  duration: number | null;
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
    instructorProfile: {
      rating: number | null;
    } | null;
  };
  _count: {
    enrollments: number;
    reviews: number;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');

  useEffect(() => {
    fetchCourses();
  }, [typeFilter, levelFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      if (levelFilter) params.append('level', levelFilter);

      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground">
            Aprenda com os melhores profissionais da beleza
          </p>

          {/* Filtros */}
          <div className="mt-6 flex gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-md border px-3"
            >
              <option value="">Todos os tipos</option>
              <option value="ONLINE">Online</option>
              <option value="PRESENCIAL">Presencial</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-10 rounded-md border px-3"
            >
              <option value="">Todos os níveis</option>
              <option value="INICIANTE">Iniciante</option>
              <option value="INTERMEDIARIO">Intermediário</option>
              <option value="AVANCADO">Avançado</option>
            </select>
          </div>

          {loading ? (
            <div className="mt-8">
              <CourseGridSkeleton count={6} />
            </div>
          ) : courses.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-lg border bg-white p-12">
              <GraduationCap className="h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Nenhum curso encontrado</h2>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/cursos/${course.id}`}
                  className="group overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={course.thumbnail || course.imageUrl || '/placeholder.png'}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute left-2 top-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          course.type === 'ONLINE'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {course.type === 'ONLINE' ? 'Online' : 'Presencial'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">
                      {course.level === 'BEGINNER' ? 'Iniciante' : course.level === 'INTERMEDIATE' ? 'Intermediário' : course.level === 'ADVANCED' ? 'Avançado' : 'Todos os níveis'}
                    </p>
                    <h3 className="mt-1 font-bold line-clamp-2 group-hover:text-primary">
                      {course.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.instructor.instructorProfile?.rating?.toFixed(1) || '0.0'}</span>
                      <span>({course._count.reviews})</span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Por {course.instructor.name}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course._count.enrollments}
                      </div>
                      {course.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}h
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        R$ {course.price.toFixed(2)}
                      </span>
                      <Button size="sm">Ver curso</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
