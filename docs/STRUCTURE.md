# Estrutura do Projeto - The Beauty Pro

Este documento detalha a arquitetura e organização do código do **The Beauty Pro**.

## 📁 Visão Geral da Estrutura

```
the-beauty-pro/
├── apps/
│   ├── web/              # Frontend Next.js 14
│   └── api/              # Backend NestJS
├── packages/
│   ├── database/         # Prisma Schema + Migrations
│   ├── ui/               # Componentes UI compartilhados
│   └── types/            # TypeScript types compartilhados
├── docs/                 # Documentação
├── docker-compose.yml    # Setup Docker para desenvolvimento
├── turbo.json            # Configuração Turborepo
└── package.json          # Root package.json
```

## 🎨 Frontend (apps/web)

O frontend é construído com **Next.js 14** usando o **App Router**.

### Estrutura de Pastas

```
apps/web/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (auth)/             # Rotas de autenticação
│   │   │   ├── entrar/         # Login
│   │   │   └── cadastro/       # Registro
│   │   ├── (dashboard)/        # Rotas protegidas
│   │   │   ├── dashboard/      # Dashboard vendedor/instrutor
│   │   │   ├── produtos/       # Gestão de produtos
│   │   │   └── cursos/         # Gestão de cursos
│   │   ├── produtos/           # Listagem e detalhes de produtos
│   │   ├── cursos/             # Listagem e detalhes de cursos
│   │   ├── carrinho/           # Carrinho de compras
│   │   ├── checkout/           # Finalização de compra
│   │   ├── layout.tsx          # Layout root
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Estilos globais
│   ├── components/
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── home/               # Componentes da home
│   │   ├── products/           # Componentes de produtos
│   │   ├── courses/            # Componentes de cursos
│   │   ├── dashboard/          # Componentes do dashboard
│   │   └── ui/                 # Componentes UI base (se não usar @thebeautypro/ui)
│   ├── lib/
│   │   ├── api.ts              # Client HTTP para API
│   │   ├── auth.ts             # Helpers de autenticação
│   │   └── utils.ts            # Funções utilitárias
│   ├── providers/
│   │   └── auth-provider.tsx   # Provider de autenticação
│   ├── hooks/                  # React hooks customizados
│   ├── store/                  # State management (Zustand)
│   └── types/                  # Types específicos do frontend
├── public/
│   └── images/                 # Imagens estáticas
└── next.config.js
```

### Principais Tecnologias

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Utility-first CSS
- **Shadcn/UI**: Componentes UI acessíveis
- **NextAuth.js**: Autenticação
- **Zustand**: State management
- **Zod**: Validação de schemas

### Padrões de Código

#### Server Components vs Client Components

Por padrão, use **Server Components** (Next.js 14):

```tsx
// Server Component (padrão)
export default async function ProductsPage() {
  const products = await getProducts(); // Fetch no servidor
  return <ProductsList products={products} />;
}
```

Use **Client Components** apenas quando necessário (`use client`):

```tsx
'use client';

import { useState } from 'react';

export function ProductFilter() {
  const [filter, setFilter] = useState('');
  // ...
}
```

#### Server Actions

Use Server Actions para mutations:

```tsx
'use server';

import { prisma } from '@thebeautypro/database';

export async function createProduct(data: FormData) {
  const product = await prisma.product.create({
    data: {
      name: data.get('name'),
      // ...
    },
  });

  revalidatePath('/dashboard/produtos');
  return product;
}
```

## 🔧 Backend (apps/api)

O backend é construído com **NestJS**, um framework Node.js enterprise-grade.

### Estrutura de Pastas

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/               # Autenticação e autorização
│   │   │   ├── strategies/     # Passport strategies (JWT, Local)
│   │   │   ├── guards/         # Guards de autenticação
│   │   │   ├── decorators/     # Custom decorators
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── users/              # Gestão de usuários
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── products/           # CRUD de produtos
│   │   ├── courses/            # CRUD de cursos
│   │   ├── orders/             # Gestão de pedidos
│   │   ├── payments/           # Integração com Mercado Pago
│   │   └── categories/         # Categorias
│   ├── database/
│   │   ├── database.service.ts # Prisma Client wrapper
│   │   └── database.module.ts
│   ├── common/
│   │   ├── filters/            # Exception filters
│   │   ├── interceptors/       # Interceptors
│   │   ├── pipes/              # Validation pipes
│   │   └── decorators/         # Custom decorators
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
└── test/
```

### Principais Tecnologias

- **NestJS**: Framework Node.js
- **Prisma**: ORM
- **Passport**: Autenticação
- **JWT**: Tokens de autenticação
- **Swagger**: Documentação da API
- **class-validator**: Validação de DTOs
- **mercadopago**: SDK Mercado Pago

### Padrões de Código

#### Estrutura de um Módulo

Cada módulo segue o padrão:

```
module-name/
├── dto/
│   ├── create-module.dto.ts
│   └── update-module.dto.ts
├── entities/
│   └── module.entity.ts (opcional)
├── module-name.controller.ts
├── module-name.service.ts
└── module-name.module.ts
```

#### Controller

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

#### Service

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    return this.db.product.findMany({
      where: { status: 'ACTIVE' },
      include: { category: true },
    });
  }

  async create(data: CreateProductDto) {
    return this.db.product.create({
      data,
    });
  }
}
```

## 🗄️ Database (packages/database)

O package **database** contém o Prisma Schema e é compartilhado entre frontend e backend.

### Estrutura

```
packages/database/
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   ├── migrations/           # Histórico de migrations
│   └── seed.ts               # Dados iniciais
├── index.ts                  # Export do Prisma Client
└── package.json
```

### Prisma Client

O Prisma Client é exportado e pode ser usado em qualquer app:

```typescript
import { prisma } from '@thebeautypro/database';

const users = await prisma.user.findMany();
```

### Migrations

```bash
# Criar uma nova migration
npx prisma migrate dev --name add_new_field

# Aplicar migrations em produção
npx prisma migrate deploy

# Visualizar o banco no Prisma Studio
npx prisma studio
```

## 🎨 UI Components (packages/ui)

Componentes UI reutilizáveis baseados em **Shadcn/UI**.

### Estrutura

```
packages/ui/
├── lib/
│   └── utils.ts              # Utilitários (cn function)
├── button.tsx                # Componente Button
├── card.tsx                  # Componente Card
├── dialog.tsx                # Componente Dialog
└── index.tsx                 # Exports
```

### Uso

```tsx
import { Button } from '@thebeautypro/ui/button';

export function MyComponent() {
  return <Button variant="primary">Click me</Button>;
}
```

## 📘 Types (packages/types)

Types TypeScript compartilhados entre frontend e backend.

```typescript
import type { User, Product, Order } from '@thebeautypro/types';
```

## 🔄 Fluxo de Dados

### 1. Criação de Produto (Exemplo)

```
Frontend (Next.js)
  └─> Server Action (createProduct)
      └─> API (NestJS) POST /products
          └─> ProductsService
              └─> Prisma Client
                  └─> PostgreSQL
```

### 2. Listagem de Produtos (Exemplo)

```
Frontend (Next.js)
  └─> Server Component (fetch)
      └─> API (NestJS) GET /products
          └─> ProductsService
              └─> Prisma Client
                  └─> PostgreSQL
                      └─> Return data
```

## 🚀 Próximos Passos

- Ver [SETUP.md](./SETUP.md) para configurar o ambiente
- Ver [CHECKLIST.md](./CHECKLIST.md) para acompanhar o desenvolvimento
- Ver [API.md](./API.md) para documentação detalhada da API (em breve)
