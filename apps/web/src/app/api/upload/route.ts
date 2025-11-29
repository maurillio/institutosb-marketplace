import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export const runtime = 'edge';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

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

    // Upload para Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
}
