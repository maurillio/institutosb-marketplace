'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  condition: string;
  stock?: number;
  category: {
    name: string;
    slug: string;
  };
  seller: {
    user: {
      name: string;
    };
    rating: number | null;
  };
  _count: {
    reviews: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoriaPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchCategoryAndProducts();
    }
  }, [params.slug]);

  const fetchCategoryAndProducts = async () => {
    try {
      // Buscar informações da categoria primeiro
      const categoriesResponse = await fetch('/api/categories');
      const categories = await categoriesResponse.json();
      const currentCategory = categories.find(
        (cat: Category) => cat.slug === params.slug
      );

      if (currentCategory) {
        setCategory(currentCategory);

        // Buscar produtos por categoria ID
        const response = await fetch(`/api/products?categoryId=${currentCategory.id}`);
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Início
            </Link>
            {' > '}
            <Link href="/categorias" className="hover:text-primary">
              Categorias
            </Link>
            {category && (
              <>
                {' > '}
                <span className="text-gray-900">{category.name}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-8">
            {category ? category.name : 'Categoria'}
          </h1>

          {loading ? (
            <p>Carregando produtos...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Nenhum produto encontrado nesta categoria.
              </p>
              <Link
                href="/produtos"
                className="text-primary hover:underline"
              >
                Ver todos os produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
