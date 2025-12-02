'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId?: string;
  courseId?: string;
  existingReview?: {
    id: string;
    rating: number;
    title: string | null;
    comment: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  productId,
  courseId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);

  const isEditing = !!existingReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('O comentário deve ter pelo menos 10 caracteres');
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/reviews/${existingReview.id}`
        : productId
        ? `/api/products/${productId}/reviews`
        : `/api/courses/${courseId}/reviews`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title: title.trim() || null,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar avaliação');
      }

      toast.success(
        isEditing
          ? 'Avaliação atualizada com sucesso!'
          : 'Avaliação enviada com sucesso!'
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao salvar review:', error);
      toast.error(error.message || 'Erro ao salvar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Sua avaliação *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {rating === 1 && 'Péssimo'}
              {rating === 2 && 'Ruim'}
              {rating === 3 && 'Regular'}
              {rating === 4 && 'Bom'}
              {rating === 5 && 'Excelente'}
            </span>
          )}
        </div>
      </div>

      {/* Título (opcional) */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          Título (opcional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resuma sua experiência em poucas palavras"
          maxLength={100}
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {title.length}/100 caracteres
        </p>
      </div>

      {/* Comentário */}
      <div>
        <label htmlFor="comment" className="mb-2 block text-sm font-medium">
          Comentário *
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência detalhada com este produto/curso..."
          rows={5}
          required
          minLength={10}
          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Mínimo 10 caracteres ({comment.length} digitados)
        </p>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading || rating === 0}>
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Enviar Avaliação'}
        </Button>
      </div>
    </form>
  );
}
