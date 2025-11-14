// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types (matching Prisma schema)
export type UserRole = 'CUSTOMER' | 'SELLER' | 'INSTRUCTOR' | 'ADMIN';
export type AccountStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: UserRole[];
  status: AccountStatus;
  createdAt: Date;
}

// Product types
export type ProductCondition =
  | 'NEW'
  | 'USED_LIKE_NEW'
  | 'USED_GOOD'
  | 'USED_FAIR';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'SOLD';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  condition: ProductCondition;
  status: ProductStatus;
  images: string[];
  rating: number;
  categoryId: string;
  sellerId: string;
}

// Course types
export type CourseType = 'ONLINE' | 'IN_PERSON' | 'HYBRID';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  type: CourseType;
  level: CourseLevel;
  status: CourseStatus;
  thumbnail?: string;
  duration?: number;
  rating: number;
  enrollments: number;
  instructorId: string;
}

// Order types
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

// Payment types
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
}

// Cart types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variationData?: any;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

// Seller Profile types
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'PREMIUM';

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description?: string;
  logo?: string;
  banner?: string;
  plan: SubscriptionPlan;
  totalSales: number;
  rating: number;
  totalReviews: number;
  balance: number;
}

// Dashboard types
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  newStudents: number;
}

export interface SalesChart {
  date: string;
  revenue: number;
  orders: number;
}
