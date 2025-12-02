'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Settings, DollarSign, Shield, Sliders } from 'lucide-react';

interface SystemSettings {
  platformFeePercentage: number;
  minPayoutAmount: number;
  maintenanceMode: boolean;
  allowNewSellers: boolean;
  allowNewInstructors: boolean;
  requireSellerApproval: boolean;
  requireProductApproval: boolean;
  requireCourseApproval: boolean;
  maxProductImages: number;
  maxCourseModules: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Verificar autenticação e role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar?redirect=/admin/settings');
      return;
    }

    if (status === 'authenticated') {
      const roles = session.user.roles || [];
      if (!roles.includes('ADMIN')) {
        router.push('/');
        return;
      }
      fetchSettings();
    }
  }, [status, session, router]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');

      if (!response.ok) {
        throw new Error('Erro ao buscar configurações');
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao buscar configurações');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar configuração');
      }

      toast.success('Configuração atualizada com sucesso');

      // Atualizar estado local
      setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    } catch (error: any) {
      console.error('Erro ao atualizar configuração:', error);
      toast.error(error.message || 'Erro ao atualizar configuração');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || !session || loading || !settings) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <p className="text-muted-foreground">Carregando configurações...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as configurações globais da plataforma
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="mb-8">
              <Tabs.Trigger value="general">
                <Settings className="h-4 w-4 mr-2" />
                Geral
              </Tabs.Trigger>
              <Tabs.Trigger value="fees">
                <DollarSign className="h-4 w-4 mr-2" />
                Taxas e Pagamentos
              </Tabs.Trigger>
              <Tabs.Trigger value="approvals">
                <Shield className="h-4 w-4 mr-2" />
                Aprovações
              </Tabs.Trigger>
              <Tabs.Trigger value="limits">
                <Sliders className="h-4 w-4 mr-2" />
                Limites
              </Tabs.Trigger>
            </Tabs.List>

            {/* Tab: Geral */}
            <Tabs.Content value="general">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Modo de Manutenção</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ativa o modo de manutenção e impede acesso à plataforma
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                        disabled={saving}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Permissões de Cadastro</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Permitir Novos Vendedores</p>
                        <p className="text-sm text-muted-foreground">
                          Permite que usuários se cadastrem como vendedores
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.allowNewSellers}
                          onChange={(e) => updateSetting('allowNewSellers', e.target.checked)}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Permitir Novos Instrutores</p>
                        <p className="text-sm text-muted-foreground">
                          Permite que usuários se cadastrem como instrutores
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.allowNewInstructors}
                          onChange={(e) => updateSetting('allowNewInstructors', e.target.checked)}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Notificações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações por Email</p>
                        <p className="text-sm text-muted-foreground">
                          Envia notificações automáticas por email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações por SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Envia notificações automáticas por SMS
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            </Tabs.Content>

            {/* Tab: Taxas e Pagamentos */}
            <Tabs.Content value="fees">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Taxa da Plataforma</h3>
                  <div className="max-w-md">
                    <label className="block text-sm font-medium mb-2">
                      Percentual de taxa sobre vendas (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.platformFeePercentage}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          setSettings({ ...settings, platformFeePercentage: value });
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          updateSetting('platformFeePercentage', value);
                        }
                      }}
                      disabled={saving}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Taxa cobrada sobre cada venda realizada na plataforma
                    </p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Valor Mínimo de Saque</h3>
                  <div className="max-w-md">
                    <label className="block text-sm font-medium mb-2">
                      Valor mínimo em reais (R$)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.minPayoutAmount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          setSettings({ ...settings, minPayoutAmount: value });
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          updateSetting('minPayoutAmount', value);
                        }
                      }}
                      disabled={saving}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Valor mínimo que vendedores/instrutores podem solicitar saque
                    </p>
                  </div>
                </Card>
              </div>
            </Tabs.Content>

            {/* Tab: Aprovações */}
            <Tabs.Content value="approvals">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Aprovações Obrigatórias</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Aprovar Vendedores</p>
                        <p className="text-sm text-muted-foreground">
                          Requer aprovação manual de novos vendedores
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireSellerApproval}
                          onChange={(e) => updateSetting('requireSellerApproval', e.target.checked)}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Aprovar Produtos</p>
                        <p className="text-sm text-muted-foreground">
                          Requer aprovação manual de novos produtos
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireProductApproval}
                          onChange={(e) => updateSetting('requireProductApproval', e.target.checked)}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Aprovar Cursos</p>
                        <p className="text-sm text-muted-foreground">
                          Requer aprovação manual de novos cursos
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireCourseApproval}
                          onChange={(e) => updateSetting('requireCourseApproval', e.target.checked)}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            </Tabs.Content>

            {/* Tab: Limites */}
            <Tabs.Content value="limits">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de Produtos</h3>
                  <div className="max-w-md">
                    <label className="block text-sm font-medium mb-2">
                      Máximo de imagens por produto
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxProductImages}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setSettings({ ...settings, maxProductImages: value });
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= 100) {
                          updateSetting('maxProductImages', value);
                        }
                      }}
                      disabled={saving}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Quantidade máxima de imagens que um produto pode ter
                    </p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de Cursos</h3>
                  <div className="max-w-md">
                    <label className="block text-sm font-medium mb-2">
                      Máximo de módulos por curso
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxCourseModules}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setSettings({ ...settings, maxCourseModules: value });
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= 100) {
                          updateSetting('maxCourseModules', value);
                        }
                      }}
                      disabled={saving}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Quantidade máxima de módulos que um curso pode ter
                    </p>
                  </div>
                </Card>
              </div>
            </Tabs.Content>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
