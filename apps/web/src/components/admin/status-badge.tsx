import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  type?: 'user' | 'product' | 'course' | 'order';
}

// Mapeamento de cores por status
const STATUS_VARIANTS = {
  // Status "verde" - ativo, aprovado, publicado, completo
  ACTIVE: 'success',
  PUBLISHED: 'success',
  COMPLETED: 'success',
  DELIVERED: 'success',
  PAID: 'success',

  // Status "amarelo" - pendente, rascunho, aguardando
  PENDING: 'warning',
  DRAFT: 'warning',
  PENDING_VERIFICATION: 'warning',
  PROCESSING: 'warning',
  SHIPPED: 'warning',

  // Status "cinza" - inativo, arquivado
  INACTIVE: 'secondary',
  ARCHIVED: 'secondary',
  OUT_OF_STOCK: 'secondary',

  // Status "vermelho" - suspenso, cancelado, reprovado
  SUSPENDED: 'error',
  CANCELLED: 'error',
  REJECTED: 'error',
  SOLD: 'error',
} as const;

// Mapeamento de labels em português
const STATUS_LABELS: Record<string, string> = {
  // User status
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
  PENDING_VERIFICATION: 'Pendente Verificação',

  // Product status
  DRAFT: 'Rascunho',
  OUT_OF_STOCK: 'Sem Estoque',
  SOLD: 'Vendido',

  // Course status
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',

  // Order status
  PENDING: 'Pendente',
  PAID: 'Pago',
  PROCESSING: 'Processando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  COMPLETED: 'Completo',
  CANCELLED: 'Cancelado',
  REJECTED: 'Rejeitado',
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const variant = (STATUS_VARIANTS[status as keyof typeof STATUS_VARIANTS] || 'default') as any;
  const label = STATUS_LABELS[status] || status;

  return <Badge variant={variant}>{label}</Badge>;
}
