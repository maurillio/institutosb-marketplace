'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@thebeautypro/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemsCount } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    // TODO: Implementar checkout
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">Seu carrinho está vazio</h2>
            <p className="mt-2 text-muted-foreground">
              Adicione produtos para continuar comprando
            </p>
            <Button asChild className="mt-6">
              <Link href="/produtos">Ver produtos</Link>
            </Button>
          </div>
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
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <p className="text-muted-foreground">
            {itemsCount} {itemsCount === 1 ? 'item' : 'itens'} no carrinho
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Lista de itens */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border bg-white p-4"
                  >
                    {/* Imagem do produto */}
                    <Link
                      href={`/produtos/${item.productId}`}
                      className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
                    >
                      <Image
                        src={item.imageUrl || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Informações do produto */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/produtos/${item.productId}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          {item.variationName && (
                            <p className="text-sm text-muted-foreground">
                              {item.variationName}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-auto flex items-end justify-between">
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Preço */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            R$ {item.price.toFixed(2)} cada
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão limpar carrinho */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar carrinho
              </Button>
            </div>

            {/* Resumo do pedido */}
            <div>
              <div className="sticky top-24 rounded-lg border bg-white p-6">
                <h2 className="text-xl font-bold">Resumo do pedido</h2>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})
                    </span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium text-green-600">
                      Calculado no checkout
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Finalizar compra
                </Button>

                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  asChild
                >
                  <Link href="/produtos">Continuar comprando</Link>
                </Button>

                {/* Informações de segurança */}
                <div className="mt-6 space-y-2 border-t pt-6 text-sm text-muted-foreground">
                  <p>✓ Compra 100% segura e protegida</p>
                  <p>✓ Frete calculado no checkout</p>
                  <p>✓ Várias formas de pagamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
