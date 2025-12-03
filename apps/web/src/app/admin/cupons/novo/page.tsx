'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { Card } from '@thebeautypro/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    applicability: 'ALL_PRODUCTS' as 'ALL_PRODUCTS' | 'SPECIFIC_CATEGORIES' | 'SPECIFIC_PRODUCTS',
    maxUses: '',
    maxUsesPerUser: '',
    validFrom: '',
    validUntil: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!formData.code || !formData.value || !formData.validFrom) {
        toast.error('Preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          type: formData.type,
          value: parseFloat(formData.value),
          minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          applicability: formData.applicability,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : null,
          validFrom: formData.validFrom,
          validUntil: formData.validUntil || null,
          description: formData.description || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar cupom');
      }

      toast.success('Cupom criado com sucesso!');
      router.push('/admin/cupons');
    } catch (error: any) {
      console.error('Erro ao criar cupom:', error);
      toast.error(error.message || 'Erro ao criar cupom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/admin/cupons"
              className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para cupons
            </Link>
            <h1 className="text-3xl font-bold">Criar Novo Cupom</h1>
            <p className="mt-1 text-muted-foreground">
              Preencha os dados do cupom de desconto
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Formulário */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informações Básicas */}
                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Informações Básicas</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Código do Cupom *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value.toUpperCase() })
                        }
                        placeholder="DESCONTO10"
                        required
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm uppercase"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Código que o cliente usará no checkout
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Descrição</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Descrição do cupom para exibir ao cliente"
                        rows={3}
                        className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </Card>

                {/* Configurações de Desconto */}
                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Configurações de Desconto</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Tipo de Desconto *</label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as any })
                        }
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      >
                        <option value="PERCENTAGE">Porcentagem (%)</option>
                        <option value="FIXED_AMOUNT">Valor Fixo (R$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Valor *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.value}
                        onChange={(e) =>
                          setFormData({ ...formData, value: e.target.value })
                        }
                        placeholder={formData.type === 'PERCENTAGE' ? '10' : '50.00'}
                        required
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formData.type === 'PERCENTAGE'
                          ? 'Porcentagem de desconto (ex: 10 para 10%)'
                          : 'Valor fixo em reais (ex: 50.00)'}
                      </p>
                    </div>

                    {formData.type === 'PERCENTAGE' && (
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Desconto Máximo (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.maxDiscount}
                          onChange={(e) =>
                            setFormData({ ...formData, maxDiscount: e.target.value })
                          }
                          placeholder="100.00"
                          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Opcional: limite máximo de desconto em reais
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Valor Mínimo do Pedido (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.minOrderValue}
                        onChange={(e) =>
                          setFormData({ ...formData, minOrderValue: e.target.value })
                        }
                        placeholder="100.00"
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Opcional: valor mínimo do pedido para usar o cupom
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Limitações de Uso */}
                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Limitações de Uso</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Limite de Usos Total
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxUses}
                        onChange={(e) =>
                          setFormData({ ...formData, maxUses: e.target.value })
                        }
                        placeholder="Ilimitado"
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Deixe vazio para usos ilimitados
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Limite de Usos por Usuário
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxUsesPerUser}
                        onChange={(e) =>
                          setFormData({ ...formData, maxUsesPerUser: e.target.value })
                        }
                        placeholder="Ilimitado"
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Quantas vezes cada usuário pode usar este cupom
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Validade */}
                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Validade</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Válido a partir de *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.validFrom}
                        onChange={(e) =>
                          setFormData({ ...formData, validFrom: e.target.value })
                        }
                        required
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Válido até</label>
                      <input
                        type="datetime-local"
                        value={formData.validUntil}
                        onChange={(e) =>
                          setFormData({ ...formData, validUntil: e.target.value })
                        }
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Deixe vazio para sem data de expiração
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Preview/Resumo */}
              <div>
                <Card className="sticky top-24 p-6">
                  <h2 className="mb-4 text-lg font-semibold">Resumo</h2>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Código</p>
                      <p className="font-mono font-bold">
                        {formData.code || 'DESCONTO10'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Desconto</p>
                      <p className="font-bold">
                        {formData.type === 'PERCENTAGE'
                          ? `${formData.value || '0'}%`
                          : `R$ ${formData.value || '0'}`}
                      </p>
                    </div>

                    {formData.minOrderValue && (
                      <div>
                        <p className="text-muted-foreground">Pedido mínimo</p>
                        <p className="font-medium">R$ {formData.minOrderValue}</p>
                      </div>
                    )}

                    {formData.maxUses && (
                      <div>
                        <p className="text-muted-foreground">Usos totais</p>
                        <p className="font-medium">{formData.maxUses}</p>
                      </div>
                    )}

                    {formData.validFrom && (
                      <div>
                        <p className="text-muted-foreground">Válido de</p>
                        <p className="font-medium">
                          {new Date(formData.validFrom).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Criando...' : 'Criar Cupom'}
                    </Button>
                    <Link href="/admin/cupons">
                      <Button type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
