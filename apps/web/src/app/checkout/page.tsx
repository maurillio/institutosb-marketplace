'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@thebeautypro/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin, Tag, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Address {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, total, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Endereço, 2: Revisão, 3: Pagamento

  // Formulário de endereço
  const [address, setAddress] = useState<Address>({
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');

  // Cupom de desconto
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    type: string;
    value: number;
    description: string | null;
  } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/checkout');
    }
  }, [status, router]);

  // Redirecionar se carrinho vazio
  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrinho');
    }
  }, [items, router]);

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value.replace(/\D/g, '');
    setAddress({ ...address, zipCode });

    // Buscar endereço pelo CEP (ViaCEP)
    if (zipCode.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setAddress({
            ...address,
            zipCode,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          });

          // Calcular frete (simulação)
          calculateShipping(zipCode);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const calculateShipping = (zipCode: string) => {
    // Simulação de cálculo de frete
    // Em produção, integrar com API de transportadora (Correios, etc)
    const basePrice = 15;
    const pricePerItem = 5;
    const estimated = basePrice + (items.length * pricePerItem);
    setShippingCost(estimated);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    setValidatingCoupon(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderTotal: total,
          productIds: items.map(item => item.productId),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        toast.error(data.error || 'Cupom inválido');
        return;
      }

      setAppliedCoupon(data.coupon);
      setDiscount(data.discountAmount);
      toast.success('Cupom aplicado com sucesso!');
    } catch (error) {
      console.error('Erro ao validar cupom:', error);
      toast.error('Erro ao validar cupom');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast.success('Cupom removido');
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      // 1. Criar pedido
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            imageUrl: item.imageUrl,
          })),
          shippingAddress: address,
          billingAddress: address,
          paymentMethod,
          shippingCost,
          couponId: appliedCoupon?.id,
          discount,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Erro ao criar pedido');
      }

      const order = await orderResponse.json();

      // 2. Criar preferência de pagamento no Mercado Pago
      const finalTotal = total + shippingCost - discount;
      const paymentResponse = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
            price: item.price,
          })),
          total: finalTotal,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      const { initPoint, sandboxInitPoint } = await paymentResponse.json();

      // 3. Redirecionar para Mercado Pago
      // Em desenvolvimento, use sandboxInitPoint
      const paymentUrl = process.env.NODE_ENV === 'production' ? initPoint : sandboxInitPoint;

      // Limpar carrinho
      clearCart();

      // Redirecionar para checkout do Mercado Pago
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
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
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/carrinho"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao carrinho
            </Link>
          </div>

          <h1 className="text-3xl font-bold">Finalizar Compra</h1>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step >= s
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`mx-2 h-1 w-16 ${
                      step > s ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Formulário */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="rounded-lg border bg-white p-6">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <MapPin className="h-5 w-5" />
                    Endereço de Entrega
                  </h2>

                  <div className="mt-6 space-y-4">
                    {/* CEP */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          CEP *
                        </label>
                        <input
                          type="text"
                          value={address.zipCode}
                          onChange={handleZipCodeChange}
                          placeholder="00000-000"
                          maxLength={9}
                          required
                          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                        />
                      </div>
                    </div>

                    {/* Rua */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Rua *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) =>
                          setAddress({ ...address, street: e.target.value })
                        }
                        required
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                    </div>

                    {/* Número e Complemento */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Número *
                        </label>
                        <input
                          type="text"
                          value={address.number}
                          onChange={(e) =>
                            setAddress({ ...address, number: e.target.value })
                          }
                          required
                          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={address.complement}
                          onChange={(e) =>
                            setAddress({ ...address, complement: e.target.value })
                          }
                          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                        />
                      </div>
                    </div>

                    {/* Bairro */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={address.neighborhood}
                        onChange={(e) =>
                          setAddress({ ...address, neighborhood: e.target.value })
                        }
                        required
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                    </div>

                    {/* Cidade e Estado */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          required
                          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Estado *
                        </label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                          }
                          maxLength={2}
                          required
                          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="mt-6 w-full"
                    onClick={() => setStep(2)}
                    disabled={!address.zipCode || !address.street || !address.number}
                  >
                    Continuar
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Resumo do endereço */}
                  <div className="rounded-lg border bg-white p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Endereço de Entrega</h2>
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Editar
                      </Button>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.complement}`}
                      </p>
                      <p>
                        {address.neighborhood} - {address.city}/{address.state}
                      </p>
                      <p>CEP: {address.zipCode}</p>
                    </div>
                  </div>

                  {/* Método de envio */}
                  <div className="rounded-lg border bg-white p-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold">
                      <Truck className="h-5 w-5" />
                      Método de Envio
                    </h2>
                    <div className="mt-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Correios - PAC</p>
                            <p className="text-sm text-muted-foreground">
                              Entrega em 7-10 dias úteis
                            </p>
                          </div>
                          <p className="font-bold">
                            R$ {shippingCost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Voltar
                    </Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>
                      Continuar para pagamento
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="rounded-lg border bg-white p-6">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <CreditCard className="h-5 w-5" />
                    Forma de Pagamento
                  </h2>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`w-full rounded-md border p-4 text-left transition-colors ${
                        paymentMethod === 'credit_card'
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium">Cartão de Crédito</p>
                      <p className="text-sm text-muted-foreground">
                        Parcele em até 12x sem juros
                      </p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`w-full rounded-md border p-4 text-left transition-colors ${
                        paymentMethod === 'pix'
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium">PIX</p>
                      <p className="text-sm text-muted-foreground">
                        Aprovação imediata
                      </p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('boleto')}
                      className={`w-full rounded-md border p-4 text-left transition-colors ${
                        paymentMethod === 'boleto'
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium">Boleto Bancário</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento em 3 dias úteis
                      </p>
                    </button>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Voltar
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleCreateOrder}
                      disabled={loading}
                    >
                      {loading ? 'Processando...' : 'Finalizar Compra'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Resumo do pedido */}
            <div>
              <div className="sticky top-24 rounded-lg border bg-white p-6">
                <h2 className="text-xl font-bold">Resumo do Pedido</h2>

                {/* Produtos */}
                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.imageUrl || 'https://via.placeholder.com/80'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qtd: {item.quantity}
                        </p>
                        <p className="text-sm font-bold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cupom de desconto */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Tag className="h-4 w-4" />
                    Cupom de Desconto
                  </h3>

                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Digite o código"
                        className="h-9 flex-1 rounded-md border border-input bg-white px-3 text-sm uppercase"
                        disabled={validatingCoupon}
                      />
                      <Button
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                      >
                        {validatingCoupon ? 'Validando...' : 'Aplicar'}
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border border-green-500 bg-green-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1 text-sm font-medium text-green-900">
                            <Check className="h-4 w-4" />
                            {appliedCoupon.code}
                          </div>
                          {appliedCoupon.description && (
                            <p className="mt-1 text-xs text-green-700">
                              {appliedCoupon.description}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-bold text-green-900">
                            -R$ {discount.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-green-700 hover:text-green-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Totais */}
                <div className="mt-6 space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">
                      {shippingCost > 0
                        ? `R$ ${shippingCost.toFixed(2)}`
                        : 'Calcular'}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span className="font-medium">-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {(total + shippingCost - discount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Segurança */}
                <div className="mt-6 space-y-2 border-t pt-6 text-xs text-muted-foreground">
                  <p>✓ Pagamento 100% seguro</p>
                  <p>✓ Proteção ao comprador</p>
                  <p>✓ Powered by Mercado Pago</p>
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
