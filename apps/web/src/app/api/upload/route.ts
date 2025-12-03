import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Configurações de upload por tipo
const UPLOAD_CONFIG = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folder: 'images',
    access: 'public' as const,
  },
  video: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    folder: 'videos',
    access: 'public' as const, // Mudar para 'private' se quiser proteção
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf'],
    folder: 'documents',
    access: 'public' as const,
  },
};

type UploadType = keyof typeof UPLOAD_CONFIG;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const type = (searchParams.get('type') || 'image') as UploadType;
    const contentType = searchParams.get('contentType');

    // Validações
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename é obrigatório' },
        { status: 400 }
      );
    }

    if (!request.body) {
      return NextResponse.json(
        { error: 'Body é obrigatório' },
        { status: 400 }
      );
    }

    if (!UPLOAD_CONFIG[type]) {
      return NextResponse.json(
        { error: `Tipo de upload inválido: ${type}` },
        { status: 400 }
      );
    }

    const config = UPLOAD_CONFIG[type];

    // Validar content type
    if (contentType && !config.allowedTypes.includes(contentType)) {
      return NextResponse.json(
        {
          error: `Tipo de arquivo não permitido. Permitidos: ${config.allowedTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validar tamanho (aproximado pelo Content-Length header)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > config.maxSize) {
      const maxSizeMB = config.maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB`,
        },
        { status: 400 }
      );
    }

    // Organizar por pasta
    const path = `${config.folder}/${filename}`;

    // Upload para Vercel Blob
    const blob = await put(path, request.body, {
      access: config.access,
      addRandomSuffix: true,
      contentType: contentType || undefined,
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      type,
      size: contentLength ? parseInt(contentLength) : undefined,
      contentType,
    });
  } catch (error: any) {
    console.error('Erro no upload:', error);

    // Mensagens de erro mais específicas
    if (error.message?.includes('size')) {
      return NextResponse.json(
        { error: 'Arquivo muito grande' },
        { status: 413 }
      );
    }

    if (error.message?.includes('type')) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado' },
        { status: 415 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}
