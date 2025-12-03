'use client';

import { useState, useRef } from 'react';
import { Upload, Video, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import { toast } from 'sonner';

interface VideoUploadProps {
  onUploadComplete: (url: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  existingUrl?: string;
}

export function VideoUpload({
  onUploadComplete,
  maxSizeMB = 500,
  acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime'],
  existingUrl,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(existingUrl || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!acceptedFormats.includes(file.type)) {
      setError(`Formato não suportado. Use: ${acceptedFormats.join(', ')}`);
      toast.error('Formato de vídeo não suportado');
      return;
    }

    // Validar tamanho
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      toast.error(`Vídeo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Simular progresso durante upload
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Upload
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}&type=video&contentType=${encodeURIComponent(file.type)}`,
        {
          method: 'POST',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer upload');
      }

      const data = await response.json();
      setVideoUrl(data.url);
      onUploadComplete(data.url);
      toast.success('Vídeo enviado com sucesso!');
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao fazer upload do vídeo');
      toast.error(err.message || 'Erro ao fazer upload do vídeo');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setVideoUrl('');
    setProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      {!videoUrl && !uploading && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
        >
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Clique para selecionar um vídeo
          </p>
          <p className="text-xs text-gray-500">
            MP4, WebM ou MOV (máx. {maxSizeMB}MB)
          </p>
        </div>
      )}

      {uploading && (
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <Upload className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Enviando vídeo...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}%</p>
            </div>
          </div>
        </div>
      )}

      {videoUrl && !uploading && (
        <div className="border border-green-300 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 mb-2">
                Vídeo enviado com sucesso!
              </p>
              <video
                src={videoUrl}
                controls
                className="w-full max-h-64 rounded-lg bg-black"
              >
                Seu navegador não suporta vídeo.
              </video>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="mt-3"
              >
                <X className="h-4 w-4 mr-2" />
                Remover vídeo
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="border border-red-300 bg-red-50 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
