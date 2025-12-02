'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@thebeautypro/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewForm } from './review-form';
import { ReviewsList } from './reviews-list';
import { ReviewStats } from './review-stats';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ReviewsSectionProps {
  productId?: string;
  courseId?: string;
  isOwner?: boolean; // Se o usuário atual é dono do produto/curso
}

interface ReviewsData {
  reviews: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    avgRating: number;
    totalReviews: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

export function ReviewsSection({ productId, courseId, isOwner }: ReviewsSectionProps) {
  const { data: session } = useSession();
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const targetId = productId || courseId;
      const targetType = productId ? 'products' : 'courses';

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        ...(filterRating && { rating: filterRating.toString() }),
      });

      const response = await fetch(
        `/api/${targetType}/${targetId}/reviews?${params}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar reviews');
      }

      const reviewsData = await response.json();
      setData(reviewsData);
    } catch (error) {
      console.error('Erro ao buscar reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, sortBy, filterRating, productId, courseId]);

  const handleReviewCreated = () => {
    setShowCreateModal(false);
    setPage(1);
    fetchReviews();
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const canReview = session?.user?.id && !isOwner;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <ReviewStats
        avgRating={data.stats.avgRating}
        totalReviews={data.stats.totalReviews}
        distribution={data.stats.distribution}
        onFilterByRating={setFilterRating}
        selectedRating={filterRating}
      />

      {/* Header com filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold">
          {data.pagination.total}{' '}
          {data.pagination.total === 1 ? 'Avaliação' : 'Avaliações'}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-md border border-input bg-white px-3 text-sm"
          >
            <option value="recent">Mais recentes</option>
            <option value="rating_high">Maior avaliação</option>
            <option value="rating_low">Menor avaliação</option>
          </select>

          {/* Botão avaliar */}
          {canReview && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Avaliar
            </Button>
          )}
        </div>
      </div>

      {/* Lista de reviews */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : (
        <ReviewsList
          reviews={data.reviews}
          currentUserId={session?.user?.id}
          isOwner={isOwner}
          onReviewUpdated={fetchReviews}
        />
      )}

      {/* Paginação */}
      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Anterior</span>
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(data.pagination.totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const showPage =
                pageNumber === 1 ||
                pageNumber === data.pagination.totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1);

              if (!showPage) {
                if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return (
                    <span key={index} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={index}
                  variant={pageNumber === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  className="min-w-[2.5rem]"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === data.pagination.totalPages}
          >
            <span className="mr-1 hidden sm:inline">Próxima</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialog para criar review */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Avaliar {productId ? 'Produto' : 'Curso'}</DialogTitle>
          </DialogHeader>
          <ReviewForm
            productId={productId}
            courseId={courseId}
            onSuccess={handleReviewCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
