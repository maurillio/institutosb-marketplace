'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PerfilPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    cpfCnpj: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        avatar: session.user.avatar || '',
        cpfCnpj: (session.user as any).cpfCnpj || '',
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('[Frontend] ========== INÍCIO ATUALIZAÇÃO ==========');
    console.log('[Frontend] Dados a enviar:', {
      name: formData.name,
      phone: formData.phone,
      avatar: formData.avatar?.substring(0, 50) + '...',
      cpfCnpj: formData.cpfCnpj,
    });

    try {
      console.log('[Frontend] Enviando requisição PATCH...');
      
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('[Frontend] Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('[Frontend] ❌ Erro na resposta:', error);
        throw new Error(error.error || 'Erro ao atualizar perfil');
      }

      const data = await response.json();
      console.log('[Frontend] ✅ Perfil atualizado:', data);

      console.log('[Frontend] Chamando update() do NextAuth...');

      // Atualizar sessão do NextAuth
      await update();
      console.log('[Frontend] ✅ Sessão atualizada');

      alert('Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('[Frontend] ❌ ERRO CRÍTICO:', error);
      alert(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Não renderizar até montar no cliente
  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirecionar se não estiver autenticado (só no cliente)
  if (!session) {
    router.push('/entrar');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
              {/* Avatar */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-6">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <ImageUpload
                      value={formData.avatar}
                      onChange={(url) => setFormData({ ...formData, avatar: url as string })}
                      multiple={false}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="mb-2 block text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 w-full rounded-md border px-3"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="h-10 w-full rounded-md border px-3 bg-gray-50 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>

              {/* Telefone */}
              <div>
                <label className="mb-2 block text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="h-10 w-full rounded-md border px-3"
                />
              </div>

              {/* CPF/CNPJ */}
              <div>
                <label className="mb-2 block text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                  placeholder="000.000.000-00"
                  className="h-10 w-full rounded-md border px-3"
                />
              </div>

              {/* Roles */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-3">Permissões</h3>
                <div className="flex flex-wrap gap-2">
                  {(session.user.roles || []).map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                    >
                      {role === 'CUSTOMER' && 'Cliente'}
                      {role === 'SELLER' && 'Vendedor'}
                      {role === 'INSTRUCTOR' && 'Instrutor'}
                      {role === 'ADMIN' && 'Administrador'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
