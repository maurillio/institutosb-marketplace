'use client';

import { Star } from 'lucide-react';

interface ReviewStatsProps {
  avgRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  onFilterByRating?: (rating: number | null) => void;
  selectedRating?: number | null;
}

export function ReviewStats({
  avgRating,
  totalReviews,
  distribution,
  onFilterByRating,
  selectedRating,
}: ReviewStatsProps) {
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="text-lg font-bold">Avaliações dos Clientes</h3>

      {/* Resumo */}
      <div className="mt-4 flex items-center gap-6 border-b pb-6">
        <div className="text-center">
          <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
          <div className="mt-1 flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(avgRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
          </div>
        </div>

        {/* Distribuição */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as keyof typeof distribution];
            const percentage = getPercentage(count);

            return (
              <button
                key={rating}
                onClick={() => onFilterByRating?.(selectedRating === rating ? null : rating)}
                className={`flex w-full items-center gap-2 text-sm transition-colors hover:bg-gray-50 ${
                  selectedRating === rating ? 'font-medium text-primary' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="w-3 text-right">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right text-muted-foreground">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      {onFilterByRating && selectedRating && (
        <div className="mt-4">
          <button
            onClick={() => onFilterByRating(null)}
            className="text-sm text-primary hover:underline"
          >
            Limpar filtro
          </button>
        </div>
      )}
    </div>
  );
}
