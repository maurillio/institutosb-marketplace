import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../../auth/[...nextauth]/route';

// GET /api/instructor/courses/[id]/students - Buscar alunos do curso
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id: courseId } = params;
    const { searchParams } = new URL(request.url);

    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filtro de status
    const statusFilter = searchParams.get('status'); // 'completed', 'in_progress', 'not_started'
    const search = searchParams.get('search') || '';

    // Verificar se o curso existe e se o usuário é o instrutor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        instructorId: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    if (course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Você não é o instrutor deste curso' },
        { status: 403 }
      );
    }

    // Construir filtros
    const where: any = {
      courseId,
    };

    // Filtro por status
    if (statusFilter === 'completed') {
      where.progress = 100;
    } else if (statusFilter === 'in_progress') {
      where.progress = { gt: 0, lt: 100 };
    } else if (statusFilter === 'not_started') {
      where.progress = 0;
    }

    // Filtro de busca por nome do aluno
    if (search) {
      where.user = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    // Buscar matrículas com dados do aluno
    const [enrollments, total] = await Promise.all([
      prisma.courseEnrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { enrolledAt: 'desc' },
        select: {
          id: true,
          enrolledAt: true,
          progress: true,
          completedAt: true,
          lastAccessedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.courseEnrollment.count({ where }),
    ]);

    // Calcular estatísticas
    const allEnrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      select: { progress: true },
    });

    const stats = {
      totalStudents: allEnrollments.length,
      completedStudents: allEnrollments.filter((e) => Number(e.progress) === 100).length,
      inProgressStudents: allEnrollments.filter(
        (e) => Number(e.progress) > 0 && Number(e.progress) < 100
      ).length,
      notStartedStudents: allEnrollments.filter((e) => Number(e.progress) === 0).length,
      averageProgress:
        allEnrollments.length > 0
          ? allEnrollments.reduce((acc, e) => acc + Number(e.progress), 0) /
            allEnrollments.length
          : 0,
    };

    // Formatar dados dos alunos
    const students = enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      student: {
        id: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
        avatar: enrollment.user.avatar,
      },
      progress: Number(enrollment.progress),
      enrolledAt: enrollment.enrolledAt.toISOString(),
      completedAt: enrollment.completedAt?.toISOString() || null,
      lastAccessedAt: enrollment.lastAccessedAt?.toISOString() || null,
      status:
        Number(enrollment.progress) === 100
          ? 'completed'
          : Number(enrollment.progress) > 0
          ? 'in_progress'
          : 'not_started',
    }));

    return NextResponse.json({
      students,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar alunos do curso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar alunos do curso' },
      { status: 500 }
    );
  }
}
