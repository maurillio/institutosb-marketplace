-- ============================================
-- CREATE TABLES - THE BEAUTY PRO MARKETPLACE
-- Execute ESTE arquivo PRIMEIRO no console Neon
-- Depois execute seed.sql, seed-products.sql, seed-courses.sql
-- ============================================

-- Criar ENUMs
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'SELLER', 'INSTRUCTOR', 'ADMIN');
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PRO', 'PREMIUM');
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'USED', 'LIKE_NEW');
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'ARCHIVED');
CREATE TYPE "CourseType" AS ENUM ('ONLINE', 'IN_PERSON', 'HYBRID');
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Tabela de Usuários
CREATE TABLE "users" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMPTZ,
    name TEXT NOT NULL,
    "cpfCnpj" TEXT UNIQUE,
    phone TEXT,
    avatar TEXT,
    password TEXT NOT NULL,
    roles "UserRole"[] DEFAULT ARRAY['CUSTOMER']::"UserRole"[],
    status "AccountStatus" DEFAULT 'PENDING_VERIFICATION',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    "lastLoginAt" TIMESTAMPTZ
);

CREATE INDEX "User_email_idx" ON "users"(email);
CREATE INDEX "User_status_idx" ON "users"(status);

-- Perfil de Vendedor
CREATE TABLE "seller_profiles" (
    id TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    "storeName" TEXT NOT NULL,
    "storeSlug" TEXT UNIQUE NOT NULL,
    description TEXT,
    logo TEXT,
    banner TEXT,
    plan "SubscriptionPlan" DEFAULT 'FREE',
    "planExpiresAt" TIMESTAMPTZ,
    "totalSales" DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    "totalReviews" INTEGER DEFAULT 0,
    balance DECIMAL(10,2) DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "SellerProfile_storeSlug_idx" ON "seller_profiles"("storeSlug");

-- Perfil de Instrutor
CREATE TABLE "instructor_profiles" (
    id TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    bio TEXT,
    expertise TEXT[],
    "totalStudents" INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    "totalReviews" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias
CREATE TABLE "categories" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    "imageUrl" TEXT,
    "parentId" TEXT REFERENCES "categories"(id) ON DELETE SET NULL,
    "order" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "Category_slug_idx" ON "categories"(slug);
CREATE INDEX "Category_parentId_idx" ON "categories"("parentId");

-- Produtos
CREATE TABLE "products" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    brand TEXT,
    "categoryId" TEXT NOT NULL REFERENCES "categories"(id) ON DELETE RESTRICT,
    "sellerId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER DEFAULT 10,
    sku TEXT,
    barcode TEXT,
    condition "ProductCondition" DEFAULT 'NEW',
    status "ProductStatus" DEFAULT 'DRAFT',
    images TEXT[],
    tags TEXT[],
    "skinTypes" TEXT[],
    concerns TEXT[],
    ingredients TEXT[],
    "publishedAt" TIMESTAMPTZ,
    rating DECIMAL(3,2) DEFAULT 0,
    "totalReviews" INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "Product_slug_idx" ON "products"(slug);
CREATE INDEX "Product_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "Product_sellerId_idx" ON "products"("sellerId");
CREATE INDEX "Product_status_idx" ON "products"(status);

-- Cursos
CREATE TABLE "courses" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    "shortDescription" TEXT,
    "instructorId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    type "CourseType" DEFAULT 'ONLINE',
    level "CourseLevel" DEFAULT 'BEGINNER',
    price DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    thumbnail TEXT,
    "previewVideo" TEXT,
    duration INTEGER,
    "maxStudents" INTEGER,
    certificate BOOLEAN DEFAULT TRUE,
    status "CourseStatus" DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ,
    rating DECIMAL(3,2) DEFAULT 0,
    "totalReviews" INTEGER DEFAULT 0,
    "totalEnrollments" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "Course_slug_idx" ON "courses"(slug);
CREATE INDEX "Course_instructorId_idx" ON "courses"("instructorId");
CREATE INDEX "Course_status_idx" ON "courses"(status);

-- Módulos do Curso
CREATE TABLE "course_modules" (
    id TEXT PRIMARY KEY,
    "courseId" TEXT NOT NULL REFERENCES "courses"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "CourseModule_courseId_idx" ON "course_modules"("courseId");

-- Aulas do Curso
CREATE TABLE "course_lessons" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "moduleId" TEXT NOT NULL REFERENCES "course_modules"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    "videoUrl" TEXT,
    duration INTEGER,
    "order" INTEGER NOT NULL,
    "isFree" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "CourseLesson_moduleId_idx" ON "course_lessons"("moduleId");

-- ============================================
-- Tabelas adicionais (NextAuth, etc)
-- ============================================

-- NextAuth: Accounts
CREATE TABLE "accounts" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    scope TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    UNIQUE(provider, "providerAccountId")
);

-- NextAuth: Sessions
CREATE TABLE "sessions" (
    id TEXT PRIMARY KEY,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

-- NextAuth: Verification Tokens
CREATE TABLE "verification_tokens" (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    UNIQUE(identifier, token)
);

-- Endereços
CREATE TABLE "addresses" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    country TEXT DEFAULT 'Brasil',
    "isDefault" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "Address_userId_idx" ON "addresses"("userId");

-- Wishlist
CREATE TABLE "wishlists" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    "productId" TEXT REFERENCES "products"(id) ON DELETE CASCADE,
    "courseId" TEXT REFERENCES "courses"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "Wishlist_userId_idx" ON "wishlists"("userId");
CREATE INDEX "Wishlist_productId_idx" ON "wishlists"("productId");
CREATE INDEX "Wishlist_courseId_idx" ON "wishlists"("courseId");

-- Reviews
CREATE TABLE "reviews" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    "productId" TEXT REFERENCES "products"(id) ON DELETE CASCADE,
    "courseId" TEXT REFERENCES "courses"(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX "Review_userId_idx" ON "reviews"("userId");
CREATE INDEX "Review_productId_idx" ON "reviews"("productId");
CREATE INDEX "Review_courseId_idx" ON "reviews"("courseId");

-- ============================================
-- CONCLUÍDO
-- ============================================
-- Todas as tabelas necessárias foram criadas!
-- Agora você pode executar os arquivos de seed na ordem:
-- 1. seed.sql
-- 2. seed-products.sql
-- 3. seed-courses.sql
-- ============================================
