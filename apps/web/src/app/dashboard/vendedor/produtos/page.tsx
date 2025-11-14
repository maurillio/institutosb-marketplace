'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@thebeautypro/ui/button';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  condition: string;
  imageUrl: string | null;
  category: {
    name: string;
  };
  _count: {
    reviews: number;
  };
}

export default function SellerProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    } else if (status === 'authenticated') {
      if (!session.user.roles.includes('SELLER') && !session.user.roles.includes('ADMIN')) {
        router.push('/');
      } else {
        fetchProducts();
      }
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/seller/products');
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/seller/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao excluir');
      fetchProducts();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir produto');
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Meus Produtos</h1>
            <Button asChild>
              <Link href="/dashboard/vendedor/produtos/novo">
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Link>
            </Button>
          </div>

          {products.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-lg border bg-white p-12">
              <Package className="h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">
                Nenhum produto cadastrado
              </h2>
              <p className="mt-2 text-muted-foreground">
                Comece cadastrando seu primeiro produto
              </p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/vendedor/produtos/novo">
                  Cadastrar Produto
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-lg border bg-white">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                            <Image
                              src={product.imageUrl || 'https://via.placeholder.com/50'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.condition === 'NEW' ? 'Novo' : 'Usado'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        R$ {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm ${
                            product.stock > 10
                              ? 'text-green-600'
                              : product.stock > 0
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            product.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/produtos/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/vendedor/produtos/${product.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
