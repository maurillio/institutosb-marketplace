import { ImageResponse } from '@vercel/og';
import { prisma } from '@thebeautypro/database';

export const runtime = 'edge';

export const alt = 'Curso - The Beauty Pro';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      select: {
        title: true,
        description: true,
        price: true,
        type: true,
        level: true,
        instructor: {
          select: {
            name: true,
            instructorProfile: {
              select: { bio: true },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 48,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            Curso não encontrado
          </div>
        ),
        { ...size }
      );
    }

    const price = course.price ? Number(course.price) : 0;
    const typeLabels: Record<string, string> = {
      ONLINE: '🎥 Online',
      IN_PERSON: '📍 Presencial',
      HYBRID: '🔀 Híbrido',
    };
    const levelLabels: Record<string, string> = {
      BEGINNER: 'Iniciante',
      INTERMEDIATE: 'Intermediário',
      ADVANCED: 'Avançado',
      ALL_LEVELS: 'Todos os Níveis',
    };

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            padding: '60px',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              The Beauty Pro
            </div>
            <div
              style={{
                display: 'flex',
                gap: '15px',
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '8px 20px',
                  borderRadius: '100px',
                }}
              >
                {typeLabels[course.type] || course.type}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '8px 20px',
                  borderRadius: '100px',
                }}
              >
                {levelLabels[course.level] || course.level}
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
              }}
            >
              {course.title}
            </div>
            <div
              style={{
                fontSize: 32,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '900px',
                lineHeight: 1.4,
              }}
            >
              {course.description.substring(0, 120)}
              {course.description.length > 120 ? '...' : ''}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {price > 0
                  ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(price)
                  : 'GRATUITO'}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                👨‍🏫 {course.instructor.name}
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'right',
              }}
            >
              {course._count.enrollments > 0 && (
                <div>👥 {course._count.enrollments} alunos</div>
              )}
              <div>📚 Plataforma EAD</div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Erro ao gerar OG image:', error);
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          The Beauty Pro
        </div>
      ),
      { ...size }
    );
  }
}
