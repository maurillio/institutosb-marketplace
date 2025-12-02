import { ColumnDef, PaginationData } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pagination,
  onPageChange,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
  const { page, totalPages, total, limit } = pagination;

  // Cálculo de range de itens exibidos
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {[...Array(limit)].map((_, index) => (
                  <tr key={index}>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabela */}
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-left text-sm font-medium text-gray-900 ${column.className || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 text-sm ${column.className || ''}`}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border bg-white px-4 sm:px-6 py-3">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            <span className="hidden sm:inline">
              Mostrando <span className="font-medium">{startItem}</span> a{' '}
              <span className="font-medium">{endItem}</span> de{' '}
            </span>
            <span className="font-medium">{total}</span> resultado{total !== 1 ? 's' : ''}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-2 sm:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Anterior</span>
            </Button>

            <div className="flex items-center space-x-1">
              {/* Páginas */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Mostrar apenas algumas páginas ao redor da página atual
                const showPage =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1);

                if (!showPage) {
                  // Mostrar reticências
                  if (pageNumber === page - 2 || pageNumber === page + 2) {
                    return (
                      <span key={index} className="px-2 text-muted-foreground text-xs sm:text-sm">
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
                    onClick={() => onPageChange(pageNumber)}
                    className="min-w-[2rem] sm:min-w-[2.5rem] px-2 sm:px-3"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline mr-1">Próxima</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
