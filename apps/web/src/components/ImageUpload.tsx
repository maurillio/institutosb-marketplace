'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  disabled = false,
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} não é uma imagem válida`);
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} é muito grande (máx 5MB)`);
        }

        // Upload para API
        const response = await fetch(
          `/api/upload?filename=${encodeURIComponent(file.name)}`,
          {
            method: 'POST',
            body: file,
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao fazer upload');
        }

        const data = await response.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);

      if (multiple) {
        const newImages = [...images, ...urls].slice(0, maxFiles);
        onChange(newImages);
      } else {
        onChange(urls[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  const canAddMore = multiple ? images.length < maxFiles : images.length === 0;

  return (
    <div className={className}>
      {/* Grid de imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden group"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled || uploading}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Área de upload */}
      {canAddMore && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`
              flex flex-col items-center justify-center
              border-2 border-dashed border-gray-300 rounded-lg
              p-6 cursor-pointer hover:border-gray-400 transition-colors
              ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Fazendo upload...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Clique para fazer upload
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF até 5MB
                  {multiple && ` (máx ${maxFiles} imagens)`}
                </p>
              </>
            )}
          </label>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Info */}
      {multiple && images.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          {images.length} de {maxFiles} imagens
        </p>
      )}
    </div>
  );
}
