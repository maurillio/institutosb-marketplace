'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { Card } from '@thebeautypro/ui/card';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  ChevronLeft,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormData {
  label: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/perfil/enderecos');
    } else if (status === 'authenticated') {
      fetchAddresses();
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses');
      if (!response.ok) throw new Error('Erro ao buscar endereços');
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar endereços');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar endereço');
      }

      toast.success(
        editingId ? 'Endereço atualizado com sucesso' : 'Endereço criado com sucesso'
      );

      resetForm();
      fetchAddresses();
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message || 'Erro ao salvar endereço');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar endereço');
      }

      toast.success('Endereço excluído com sucesso');
      fetchAddresses();
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message || 'Erro ao excluir endereço');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/addresses/${id}/set-default`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Erro ao definir endereço padrão');

      toast.success('Endereço padrão atualizado');
      fetchAddresses();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao definir endereço padrão');
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
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
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/perfil')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Meus Endereços</h1>
                <p className="text-muted-foreground">
                  Gerenciar endereços de entrega
                </p>
              </div>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Endereço
              </Button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <Card className="mb-6 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Editar Endereço' : 'Novo Endereço'}
                </h2>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium">
                      Nome do Endereço *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.label}
                      onChange={(e) =>
                        setFormData({ ...formData, label: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Ex: Casa, Trabalho, Apartamento..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      CEP *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium">
                      Rua *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={formData.complement}
                      onChange={(e) =>
                        setFormData({ ...formData, complement: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.neighborhood}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          neighborhood: e.target.value,
                        })
                      }
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Estado *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="SP, RJ, MG..."
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <label htmlFor="isDefault" className="text-sm">
                    Marcar como endereço padrão
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Salvar Endereço'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Address List */}
          {addresses.length === 0 ? (
            <Card className="p-12 text-center">
              <MapPin className="mx-auto h-20 w-20 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">
                Nenhum endereço cadastrado
              </h2>
              <p className="mt-2 text-muted-foreground">
                Adicione um endereço para facilitar suas compras
              </p>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} className="mt-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Endereço
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <Card key={address.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">{address.label}</h3>
                        {address.isDefault && (
                          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            <Star className="h-3 w-3" />
                            Padrão
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>
                          {address.street}, {address.number}
                          {address.complement && ` - ${address.complement}`}
                        </p>
                        <p>{address.neighborhood}</p>
                        <p>
                          {address.city} - {address.state}
                        </p>
                        <p className="mt-1">CEP: {address.zipCode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Tornar Padrão
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Excluir
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
