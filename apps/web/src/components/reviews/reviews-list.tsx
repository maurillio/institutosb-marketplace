'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MoreVertical, Edit, Trash, Reply, Check } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewForm } from './review-form';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  response: string | null;
  respondedAt: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  currentUserId?: string;
  isOwner?: boolean; // Vendedor ou instrutor pode responder
  onReviewUpdated?: () => void;
}

export function ReviewsList({
  reviews,
  currentUserId,
  isOwner,
  onReviewUpdated,
}: ReviewsListProps) {
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta avaliação?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar avaliação');
      }

      toast.success('Avaliação deletada com sucesso');
      if (onReviewUpdated) {
        onReviewUpdated();
      }
    } catch (error) {
      console.error('Erro ao deletar review:', error);
      toast.error('Erro ao deletar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (reviewId: string) => {
    if (responseText.trim().length < 10) {
      toast.error('A resposta deve ter pelo menos 10 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao responder avaliação');
      }

      toast.success('Resposta enviada com sucesso');
      setRespondingTo(null);
      setResponseText('');
      if (onReviewUpdated) {
        onReviewUpdated();
      }
    } catch (error: any) {
      console.error('Erro ao responder review:', error);
      toast.error(error.message || 'Erro ao responder avaliação');
    } finally {
      setLoading(false);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-muted-foreground">
          Ainda não há avaliações para este item.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Seja o primeiro a avaliar!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border bg-white p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user.name}</span>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        <Check className="h-3 w-3" />
                        Compra verificada
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {/* Stars */}
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              {(currentUserId === review.user.id || isOwner) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {currentUserId === review.user.id && (
                      <>
                        <DropdownMenuItem onClick={() => setEditingReview(review)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </>
                    )}
                    {isOwner && !review.response && (
                      <DropdownMenuItem onClick={() => setRespondingTo(review.id)}>
                        <Reply className="mr-2 h-4 w-4" />
                        Responder
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Conteúdo */}
            <div className="mt-4">
              {review.title && (
                <h4 className="font-medium">{review.title}</h4>
              )}
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>

            {/* Resposta do vendedor/instrutor */}
            {review.response && (
              <div className="mt-4 rounded-md bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Reply className="h-4 w-4" />
                  <span>Resposta do vendedor</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.respondedAt!), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {review.response}
                </p>
              </div>
            )}

            {/* Form de resposta */}
            {respondingTo === review.id && (
              <div className="mt-4 space-y-3 rounded-md border p-4">
                <label className="text-sm font-medium">Sua resposta</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Digite sua resposta..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRespondingTo(null);
                      setResponseText('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResponse(review.id)}
                    disabled={loading || responseText.trim().length < 10}
                  >
                    {loading ? 'Enviando...' : 'Enviar Resposta'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Avaliação</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <ReviewForm
              existingReview={editingReview}
              onSuccess={() => {
                setEditingReview(null);
                if (onReviewUpdated) {
                  onReviewUpdated();
                }
              }}
              onCancel={() => setEditingReview(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
