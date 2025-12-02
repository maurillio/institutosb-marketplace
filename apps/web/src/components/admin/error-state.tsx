import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorState({
  title = 'Erro ao carregar dados',
  description = 'Ocorreu um erro ao buscar os dados. Por favor, tente novamente.',
  action,
}: ErrorStateProps) {
  return (
    <Card className="p-12 border-red-200 bg-red-50">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 text-red-600">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-red-900">{title}</h3>
        <p className="text-sm text-red-700 mb-6 max-w-md">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}
