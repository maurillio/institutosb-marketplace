import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@thebeautypro/database';
import { authOptions } from '../../../auth/[...nextauth]/route';
import {
  generateCertificate,
  generateCertificateCode,
} from '@/lib/certificates/generate-certificate';

// GET /api/my-courses/[courseId]/certificate - Gerar e baixar certificado
export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { courseId } = params;

    // Buscar matrícula do usuário no curso
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId,
        userId: session.user.id,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Matrícula não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o curso foi concluído
    const progress = Number(enrollment.progress);
    if (progress < 100) {
      return NextResponse.json(
        {
          error: 'Curso não concluído',
          message: `Você completou apenas ${progress}% do curso. Complete 100% para gerar o certificado.`,
        },
        { status: 400 }
      );
    }

    // Gerar código do certificado (ou usar existente se já foi gerado)
    let certificateCode = enrollment.certificateCode;
    if (!certificateCode) {
      certificateCode = generateCertificateCode(enrollment.id, courseId);

      // Salvar código no banco
      await prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          certificateCode,
          certificateIssuedAt: new Date(),
        },
      });
    }

    // Gerar PDF do certificado
    const pdfBuffer = generateCertificate({
      studentName: enrollment.user.name || 'Aluno',
      courseName: enrollment.course.title,
      instructorName: enrollment.course.instructor.name || 'Instrutor',
      completionDate: enrollment.completedAt || new Date(),
      courseId: enrollment.courseId,
      enrollmentId: enrollment.id,
      duration: enrollment.course.duration || undefined,
      certificateCode,
    });

    // Retornar PDF como download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificado-${enrollment.course.slug}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar certificado' },
      { status: 500 }
    );
  }
}
