'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { CurrencyInput } from '@/components/CurrencyInput';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface Module {
  id?: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
}

export default function EditarCursoPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/instructor/courses/${params.id}`);
      if (!response.ok) throw new Error('Erro ao buscar curso');

      const data = await response.json();

      setFormData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        thumbnail: data.thumbnail || '',
        type: data.type,
        status: data.status,
        duration: data.duration?.toString() || '',
        level: data.level,
      });

      setModules(data.modules || []);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar curso');
      router.push('/dashboard/instrutor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const response = await fetch(`/api/instructor/courses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar curso');

      alert('Curso atualizado com sucesso!');
      router.push('/dashboard/instrutor');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar curso');
    } finally {
      setSaving(false);
    }
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: '',
        description: '',
        order: modules.length + 1,
        lessons: [],
      },
    ]);
    setExpandedModule(modules.length);
  };

  const removeModule = (index: number) => {
    if (confirm('Tem certeza que deseja remover este módulo?')) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModule = (index: number, field: string, value: any) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setModules(newModules);
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      title: '',
      description: '',
      videoUrl: '',
      duration: 0,
      order: newModules[moduleIndex].lessons.length + 1,
      isFree: false,
    });
    setModules(newModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    if (confirm('Tem certeza que deseja remover esta aula?')) {
      const newModules = [...modules];
      newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(
        (_, i) => i !== lessonIndex
      );
      setModules(newModules);
    }
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: string,
    value: any
  ) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex] = {
      ...newModules[moduleIndex].lessons[lessonIndex],
      [field]: value,
    };
    setModules(newModules);
  };

  const saveModules = async (shouldReturn: boolean = false) => {
    console.log('[Edit Course] Salvando módulos...', modules.length);
    setSaving(true);

    try {
      console.log('[Edit Course] Enviando requisição...');
      const response = await fetch(`/api/instructor/courses/${params.id}/modules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modules }),
      });

      console.log('[Edit Course] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Edit Course] Erro na resposta:', errorData);
        throw new Error(errorData.error || 'Erro ao salvar módulos');
      }

      const data = await response.json();
      console.log('[Edit Course] Módulos salvos:', data);

      alert('✅ Módulos salvos com sucesso!');

      if (shouldReturn) {
        console.log('[Edit Course] Redirecionando para dashboard...');
        router.push('/dashboard/instrutor');
      } else {
        console.log('[Edit Course] Recarregando dados...');
        await fetchCourse(); // Recarregar dados
        console.log('[Edit Course] Dados recarregados');
        // Fechar todos os módulos para dar feedback visual
        setExpandedModule(null);
      }
    } catch (error) {
      console.error('[Edit Course] Erro ao salvar módulos:', error);
      alert('❌ Erro ao salvar módulos: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      console.log('[Edit Course] Finalizando...');
      setSaving(false);
    }
  };

  if (loading) {
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
          <Link
            href="/dashboard/instrutor"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold">Editar Curso</h1>

          {/* Informações Básicas */}
          <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
            <div className="space-y-6 rounded-lg border bg-white p-6">
              <h2 className="text-xl font-semibold">Informações Básicas</h2>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Imagem de Capa do Curso *
                </label>
                <ImageUpload
                  value={formData.thumbnail}
                  onChange={(url) =>
                    setFormData({ ...formData, thumbnail: url as string })
                  }
                  multiple={false}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Título do Curso *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="h-10 w-full rounded-md border px-3"
                />
              </div>

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
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tipo do Curso *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="h-10 w-full rounded-md border px-3"
                  >
                    <option value="ONLINE">Online (EAD)</option>
                    <option value="IN_PERSON">Presencial</option>
                    <option value="HYBRID">Híbrido</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Preço *</label>
                  <CurrencyInput
                    required
                    value={formData.price}
                    onChange={(value) => setFormData({ ...formData, price: value })}
                    className="h-10 w-full rounded-md border px-3"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Duração (horas)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="h-10 w-full rounded-md border px-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Nível *</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="h-10 w-full rounded-md border px-3"
                  >
                    <option value="BEGINNER">Iniciante</option>
                    <option value="INTERMEDIATE">Intermediário</option>
                    <option value="ADVANCED">Avançado</option>
                    <option value="ALL_LEVELS">Todos os níveis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="h-10 w-full rounded-md border px-3"
                >
                  <option value="DRAFT">Rascunho</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="ARCHIVED">Arquivado</option>
                </select>
              </div>

              <div className="flex gap-3 border-t pt-6">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          </form>

          {/* Módulos e Aulas */}
          <div className="mt-8 max-w-4xl">
            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Módulos e Aulas</h2>
                <Button onClick={addModule} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Módulo
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                {modules.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhum módulo adicionado. Clique em "Adicionar Módulo" para começar.
                  </p>
                ) : (
                  modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="rounded-lg border">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          setExpandedModule(
                            expandedModule === moduleIndex ? null : moduleIndex
                          )
                        }
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {module.title || `Módulo ${moduleIndex + 1}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} aulas
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeModule(moduleIndex);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      {expandedModule === moduleIndex && (
                        <div className="border-t p-4 space-y-4">
                          <div>
                            <label className="mb-2 block text-sm font-medium">
                              Título do Módulo *
                            </label>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) =>
                                updateModule(moduleIndex, 'title', e.target.value)
                              }
                              className="h-10 w-full rounded-md border px-3"
                              placeholder="Ex: Introdução ao Curso"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium">
                              Descrição
                            </label>
                            <textarea
                              rows={2}
                              value={module.description}
                              onChange={(e) =>
                                updateModule(moduleIndex, 'description', e.target.value)
                              }
                              className="w-full rounded-md border px-3 py-2"
                              placeholder="Descreva o conteúdo deste módulo"
                            />
                          </div>

                          {/* Aulas */}
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">Aulas</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addLesson(moduleIndex)}
                              >
                                <Plus className="mr-2 h-3 w-3" />
                                Adicionar Aula
                              </Button>
                            </div>

                            {module.lessons.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhuma aula adicionada
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lessonIndex}
                                    className="rounded border bg-gray-50 p-3 space-y-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        Aula {lessonIndex + 1}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          removeLesson(moduleIndex, lessonIndex)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3 text-red-500" />
                                      </Button>
                                    </div>

                                    <input
                                      type="text"
                                      value={lesson.title}
                                      onChange={(e) =>
                                        updateLesson(
                                          moduleIndex,
                                          lessonIndex,
                                          'title',
                                          e.target.value
                                        )
                                      }
                                      className="h-9 w-full rounded-md border px-3 text-sm"
                                      placeholder="Título da aula"
                                    />

                                    <textarea
                                      rows={2}
                                      value={lesson.description}
                                      onChange={(e) =>
                                        updateLesson(
                                          moduleIndex,
                                          lessonIndex,
                                          'description',
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border px-3 py-2 text-sm"
                                      placeholder="Descrição da aula"
                                    />

                                    <div className="grid grid-cols-2 gap-2">
                                      <input
                                        type="text"
                                        value={lesson.videoUrl}
                                        onChange={(e) =>
                                          updateLesson(
                                            moduleIndex,
                                            lessonIndex,
                                            'videoUrl',
                                            e.target.value
                                          )
                                        }
                                        className="h-9 w-full rounded-md border px-3 text-sm"
                                        placeholder="URL do vídeo"
                                      />

                                      <input
                                        type="number"
                                        value={lesson.duration}
                                        onChange={(e) =>
                                          updateLesson(
                                            moduleIndex,
                                            lessonIndex,
                                            'duration',
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                        className="h-9 w-full rounded-md border px-3 text-sm"
                                        placeholder="Duração (min)"
                                      />
                                    </div>

                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={lesson.isFree}
                                        onChange={(e) =>
                                          updateLesson(
                                            moduleIndex,
                                            lessonIndex,
                                            'isFree',
                                            e.target.checked
                                          )
                                        }
                                        className="rounded"
                                      />
                                      <span className="text-sm">Aula gratuita (preview)</span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {modules.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => saveModules(false)}
                      disabled={saving}
                      variant="outline"
                      className="flex-1"
                    >
                      {saving ? 'Salvando...' : 'Salvar e Continuar Editando'}
                    </Button>
                    <Button
                      onClick={() => saveModules(true)}
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? 'Salvando...' : 'Salvar e Voltar'}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-center text-muted-foreground">
                    "Continuar Editando" recarrega os dados mantendo você na página.
                    "Voltar" salva e retorna ao dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
