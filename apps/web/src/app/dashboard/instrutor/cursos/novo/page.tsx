'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NovoCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: '',
    type: 'ONLINE',
    status: 'DRAFT',
    duration: '',
    level: 'BEGINNER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao criar curso');

      alert('Curso criado com sucesso!');
      router.push('/dashboard/instrutor');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <Link
            href="/dashboard/instrutor"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold">Novo Curso</h1>

          <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
            <div className="space-y-6 rounded-lg border bg-white p-6">
              {/* Thumbnail */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Imagem de Capa do Curso *
                </label>
                <ImageUpload
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url as string })}
                  multiple={false}
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Faça upload da imagem de capa do curso (recomendado: 1200x630px)
                </p>
              </div>

              {/* Título */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Título do Curso *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Curso Completo de Maquiagem Profissional"
                  className="h-10 w-full rounded-md border px-3"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Descrição *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva o que os alunos vão aprender neste curso..."
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              {/* Tipo e Preço */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tipo do Curso *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="h-10 w-full rounded-md border px-3"
                  >
                    <option value="ONLINE">Online (EAD)</option>
                    <option value="IN_PERSON">Presencial</option>
                    <option value="HYBRID">Híbrido</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="h-10 w-full rounded-md border px-3"
                  />
                </div>
              </div>

              {/* Duração e Nível */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Duração (horas)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ex: 40"
                    className="h-10 w-full rounded-md border px-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nível *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="h-10 w-full rounded-md border px-3"
                  >
                    <option value="BEGINNER">Iniciante</option>
                    <option value="INTERMEDIATE">Intermediário</option>
                    <option value="ADVANCED">Avançado</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="h-10 w-full rounded-md border px-3"
                >
                  <option value="DRAFT">Rascunho</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="ARCHIVED">Arquivado</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Salve como rascunho para adicionar módulos e aulas depois
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/instrutor')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Criando...' : 'Criar Curso'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
