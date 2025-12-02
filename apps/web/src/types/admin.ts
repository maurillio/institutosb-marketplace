import { ReactNode } from 'react';

// Paginação
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Definição de coluna para DataTable
export interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

// Configuração de filtro
export interface FilterConfig {
  type: 'text' | 'select' | 'date' | 'dateRange' | 'range';
  key: string;
  label: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  value?: any;
  onChange?: (value: any) => void;
}

// Filtros específicos por entidade
export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

export interface ProductFilters {
  status?: string;
  condition?: string;
  categoryId?: string;
  sellerId?: string;
  search?: string;
}

export interface CourseFilters {
  status?: string;
  type?: string;
  level?: string;
  instructorId?: string;
  search?: string;
}

// Dados de usuário para admin
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  roles: string[];
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  emailVerified: string | null;
  _count: {
    orders: number;
    products: number;
    courses: number;
  };
}

// Dados de produto para admin
export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  status: string;
  condition: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
  seller: {
    id: string;
    name: string;
    avatar: string | null;
    sellerProfile: {
      storeName: string | null;
      rating: number | null;
    } | null;
  };
  _count: {
    reviews: number;
    orderItems: number;
  };
}

// Dados de curso para admin
export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string | null;
  type: string;
  level: string;
  status: string;
  duration: number | null;
  createdAt: string;
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
    instructorProfile: {
      rating: number | null;
    } | null;
  };
  _count: {
    enrollments: number;
    reviews: number;
    modules: number;
  };
}

// Opções para selects
export const USER_ROLE_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Cliente', value: 'CUSTOMER' },
  { label: 'Vendedor', value: 'SELLER' },
  { label: 'Instrutor', value: 'INSTRUCTOR' },
  { label: 'Administrador', value: 'ADMIN' },
];

export const USER_STATUS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'ACTIVE' },
  { label: 'Inativo', value: 'INACTIVE' },
  { label: 'Suspenso', value: 'SUSPENDED' },
  { label: 'Pendente', value: 'PENDING_VERIFICATION' },
];

export const PRODUCT_STATUS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Rascunho', value: 'DRAFT' },
  { label: 'Ativo', value: 'ACTIVE' },
  { label: 'Inativo', value: 'INACTIVE' },
  { label: 'Sem Estoque', value: 'OUT_OF_STOCK' },
  { label: 'Vendido', value: 'SOLD' },
];

export const PRODUCT_CONDITION_OPTIONS = [
  { label: 'Todas', value: '' },
  { label: 'Novo', value: 'NEW' },
  { label: 'Usado - Como Novo', value: 'USED_LIKE_NEW' },
  { label: 'Usado - Muito Bom', value: 'USED_VERY_GOOD' },
  { label: 'Usado - Bom', value: 'USED_GOOD' },
  { label: 'Usado - Aceitável', value: 'USED_ACCEPTABLE' },
];

export const COURSE_STATUS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Rascunho', value: 'DRAFT' },
  { label: 'Publicado', value: 'PUBLISHED' },
  { label: 'Arquivado', value: 'ARCHIVED' },
];

export const COURSE_TYPE_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Online', value: 'ONLINE' },
  { label: 'Presencial', value: 'IN_PERSON' },
  { label: 'Híbrido', value: 'HYBRID' },
];

export const COURSE_LEVEL_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Iniciante', value: 'BEGINNER' },
  { label: 'Intermediário', value: 'INTERMEDIATE' },
  { label: 'Avançado', value: 'ADVANCED' },
  { label: 'Todos os Níveis', value: 'ALL_LEVELS' },
];
