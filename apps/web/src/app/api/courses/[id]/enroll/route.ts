import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';

// POST /api/courses/[id]/enroll - Matricular em um curso
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const courseId = params.id;

    // Verificar se o curso existe
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    if (course.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Curso não disponível para matrícula' },
        { status: 400 }
      );
    }

    // Verificar se já está matriculado
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId: session.user.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Você já está matriculado neste curso' },
        { status: 400 }
      );
    }

    // Criar matrícula
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId,
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    // Incrementar contador de matrículas do curso
    await prisma.course.update({
      where: { id: courseId },
      data: {
        totalEnrollments: {
          increment: 1,
        },
      },
    });

    // Incrementar contador de alunos do instrutor
    await prisma.instructorProfile.update({
      where: { id: course.instructorId },
      data: {
        totalStudents: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Erro ao matricular:', error);
    return NextResponse.json(
      { error: 'Erro ao processar matrícula' },
      { status: 500 }
    );
  }
}
