import { ImageResponse } from '@vercel/og';
import { prisma } from '@thebeautypro/database';

export const runtime = 'edge';

export const alt = 'Produto - The Beauty Pro';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        name: true,
        description: true,
        price: true,
        images: true,
        category: {
          select: { name: true },
        },
      },
    });

    if (!product) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 48,
              background: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            Produto não encontrado
          </div>
        ),
        { ...size }
      );
    }

    const price = Number(product.price);

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
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
              gap: '20px',
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
            {product.category && (
              <div
                style={{
                  fontSize: 24,
                  color: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '8px 20px',
                  borderRadius: '100px',
                }}
              >
                {product.category.name}
              </div>
            )}
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
              {product.name}
            </div>
            <div
              style={{
                fontSize: 32,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '900px',
                lineHeight: 1.4,
              }}
            >
              {product.description.substring(0, 120)}
              {product.description.length > 120 ? '...' : ''}
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
                fontSize: 56,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(price)}
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              ✨ Marketplace de Beleza
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
            background: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
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
