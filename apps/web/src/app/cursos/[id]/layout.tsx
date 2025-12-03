import { Metadata } from 'next';
import { prisma } from '@thebeautypro/database';
import { generateCourseMetadata } from '@/lib/seo/metadata';
import { generateCourseSchema } from '@/lib/seo/jsonld';
import { JsonLdScript } from '@/components/seo/jsonld-script';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      select: {
        title: true,
        description: true,
        imageUrl: true,
        price: true,
        level: true,
        type: true,
        instructor: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        avgRating: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return {
        title: 'Curso não encontrado',
      };
    }

    return generateCourseMetadata({
      title: course.title,
      description: course.description || 'Curso disponível na The Beauty Pro',
      imageUrl: course.imageUrl || undefined,
      instructor: course.instructor?.user.name,
      category: course.category.name,
      level: course.level || undefined,
      price: course.price ? Number(course.price) : undefined,
      type: course.type || undefined,
      rating: course.avgRating ? Number(course.avgRating) : undefined,
      enrollmentCount: course._count.enrollments,
    });
  } catch (error) {
    console.error('Error generating course metadata:', error);
    return {
      title: 'Curso',
    };
  }
}

export default async function CourseLayout({ params, children }: Props) {
  let jsonLd = null;

  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        price: true,
        level: true,
        instructor: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        avgRating: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (course) {
      jsonLd = generateCourseSchema({
        id: course.id,
        title: course.title,
        description: course.description || 'Curso disponível na The Beauty Pro',
        imageUrl: course.imageUrl || undefined,
        instructor: course.instructor
          ? {
              id: course.instructor.id,
              name: course.instructor.user.name,
            }
          : undefined,
        price: course.price ? Number(course.price) : undefined,
        level: course.level || undefined,
        rating: course.avgRating ? Number(course.avgRating) : undefined,
        enrollmentCount: course._count.enrollments,
      });
    }
  } catch (error) {
    console.error('Error generating course JSON-LD:', error);
  }

  return (
    <>
      {jsonLd && <JsonLdScript data={jsonLd} />}
      {children}
    </>
  );
}
