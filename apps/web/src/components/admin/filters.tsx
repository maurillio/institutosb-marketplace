import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';
import { FilterConfig } from '@/types/admin';

interface FilterBarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  onReset?: () => void;
  showReset?: boolean;
}

export function FilterBar({
  searchValue = '',
  searchPlaceholder = 'Buscar...',
  onSearchChange,
  filters = [],
  onReset,
  showReset = true,
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Atualiza o search pai quando o debounce terminar
  useEffect(() => {
    onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Verifica se há filtros ativos (excluindo busca vazia)
  const hasActiveFilters =
    localSearch !== '' ||
    filters.some((filter) => {
      if (!filter.value) return false;
      if (Array.isArray(filter.value)) return filter.value.length > 0;
      return filter.value !== '' && filter.value !== null && filter.value !== undefined;
    });

  const handleReset = () => {
    setLocalSearch('');
    onSearchChange('');
    onReset?.();
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Busca */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtros */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <div key={filter.key} className="min-w-[150px]">
                {filter.type === 'select' && filter.options && (
                  <Select
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange?.(e.target.value)}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}

                {filter.type === 'text' && (
                  <Input
                    placeholder={filter.placeholder || filter.label}
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange?.(e.target.value)}
                  />
                )}

                {filter.type === 'date' && (
                  <Input
                    type="date"
                    placeholder={filter.placeholder || filter.label}
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange?.(e.target.value)}
                  />
                )}
              </div>
            ))}

            {/* Botão Limpar Filtros */}
            {showReset && hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
