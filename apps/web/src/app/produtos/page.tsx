'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { ProductGridSkeleton } from '@/components/products/product-card-skeleton';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  condition: string;
  rating: number | null;
  sales: number;
  stock: number;
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

  // Filtros básicos
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [inStock, setInStock] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  // Filtros de beleza
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('');
  const [selectedConcern, setSelectedConcern] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Opções de filtros disponíveis
  const [filterOptions, setFilterOptions] = useState<any>({
    brands: [],
    skinTypes: [],
    concerns: [],
    tags: [],
  });

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

  // Buscar opções de filtros
  useEffect(() => {
    fetch('/api/products/filters')
      .then((res) => res.json())
      .then((data) => setFilterOptions(data))
      .catch((error) => console.error('Erro ao buscar filtros:', error));
  }, []);

  // Buscar produtos
  useEffect(() => {
    fetchProducts();
  }, [
    page,
    selectedCategory,
    selectedCondition,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    searchTerm,
    sortBy,
    selectedBrand,
    selectedSkinType,
    selectedConcern,
    selectedTag,
  ]);

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
      if (minRating) params.append('minRating', minRating);
      if (inStock) params.append('inStock', 'true');
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sortBy', sortBy);

      // Filtros de beleza
      if (selectedBrand) params.append('brand', selectedBrand);
      if (selectedSkinType) params.append('skinType', selectedSkinType);
      if (selectedConcern) params.append('concern', selectedConcern);
      if (selectedTag) params.append('tag', selectedTag);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      console.log('[Produtos Page] Resposta da API:', data);
      console.log('[Produtos Page] Primeiro produto:', data.products?.[0]);
      console.log('[Produtos Page] Tipo do price:', typeof data.products?.[0]?.price);

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
    setMinRating('');
    setInStock(false);
    setSearchTerm('');
    setSortBy('createdAt');
    setSelectedBrand('');
    setSelectedSkinType('');
    setSelectedConcern('');
    setSelectedTag('');
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
                <option value="-price">Maior preço</option>
                <option value="name">A-Z</option>
                <option value="-rating">Melhor avaliados</option>
                <option value="-sales">Mais vendidos</option>
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
              <h3 className="mb-4 font-semibold">Filtros Gerais</h3>
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
                    <option value="USED_LIKE_NEW">Usado - Como Novo</option>
                    <option value="USED_GOOD">Usado - Bom Estado</option>
                    <option value="USED_FAIR">Usado - Estado Regular</option>
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

                {/* Avaliação Mínima */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Avaliação Mínima
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="4">⭐⭐⭐⭐ 4+ estrelas</option>
                    <option value="3">⭐⭐⭐ 3+ estrelas</option>
                    <option value="2">⭐⭐ 2+ estrelas</option>
                    <option value="1">⭐ 1+ estrelas</option>
                  </select>
                </div>

                {/* Disponibilidade */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Disponibilidade
                  </label>
                  <label className="flex h-10 items-center gap-2 rounded-md border border-input bg-white px-3 text-sm cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Somente em estoque</span>
                  </label>
                </div>
              </div>

              <h3 className="mb-4 mt-6 font-semibold">Filtros de Beleza</h3>
              <div className="grid gap-6 md:grid-cols-4">
                {/* Marca */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Todas as marcas</option>
                    {filterOptions.brands.map((brand: string) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Pele */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tipo de Pele
                  </label>
                  <select
                    value={selectedSkinType}
                    onChange={(e) => setSelectedSkinType(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Todos os tipos</option>
                    {filterOptions.skinTypes.map((type: any) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preocupação */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Preocupação
                  </label>
                  <select
                    value={selectedConcern}
                    onChange={(e) => setSelectedConcern(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Todas</option>
                    {filterOptions.concerns.map((concern: any) => (
                      <option key={concern.value} value={concern.value}>
                        {concern.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Características */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Características
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Todas</option>
                    {filterOptions.tags.map((tag: any) => (
                      <option key={tag.value} value={tag.value}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={fetchProducts}>Aplicar filtros</Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          )}

          {/* Grid de produtos */}
          {loading ? (
            <ProductGridSkeleton count={12} />
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
