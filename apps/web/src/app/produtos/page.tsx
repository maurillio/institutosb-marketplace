'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  condition: string;
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
  _count: {
    products: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  // Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Buscar categorias
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Erro ao buscar categorias:', error));
  }, []);

  // Buscar produtos
  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, selectedCondition, minPrice, maxPrice, searchTerm, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedCondition) params.append('condition', selectedCondition);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSortBy('createdAt');
    setPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Cabeçalho */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">
              Encontre os melhores produtos de beleza
            </p>
          </div>

          {/* Busca e filtros */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Barra de busca */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-white px-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </form>

            {/* Ordenação e filtros */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="createdAt">Mais recentes</option>
                <option value="price">Menor preço</option>
                <option value="name">A-Z</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Painel de filtros */}
          {showFilters && (
            <div className="mb-6 rounded-lg border bg-white p-6">
              <div className="grid gap-6 md:grid-cols-4">
                {/* Categoria */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Todas</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat._count.products})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condição */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Condição
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="NEW">Novo</option>
                    <option value="USED">Usado</option>
                  </select>
                </div>

                {/* Preço mínimo */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Preço mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="R$ 0,00"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  />
                </div>

                {/* Preço máximo */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Preço máximo
                  </label>
                  <input
                    type="number"
                    placeholder="R$ 9999,00"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button onClick={fetchProducts}>Aplicar filtros</Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          )}

          {/* Grid de produtos */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <p className="text-lg font-medium">Nenhum produto encontrado</p>
              <p className="text-sm text-muted-foreground">
                Tente ajustar os filtros
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          onClick={() => setPage(pageNum)}
                          size="icon"
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
