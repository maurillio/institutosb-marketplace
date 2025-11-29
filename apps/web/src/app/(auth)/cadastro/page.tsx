'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validação básica no frontend
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // Chama a API de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta');
        setIsLoading(false);
        return;
      }

      // Sucesso! Mostra mensagem e faz login automático
      setSuccess(true);

      // Faz login automático após 1 segundo
      setTimeout(async () => {
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        router.push('/');
        router.refresh();
      }, 1000);

    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary">The Beauty Pro</h1>
            </Link>
            <p className="text-muted-foreground mt-2">
              Crie sua conta gratuitamente
            </p>
          </div>

          {/* Mensagem de Sucesso */}
          {success && (
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-md p-3 mb-6 text-sm">
              ✓ Conta criada com sucesso! Redirecionando...
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
              >
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="Maria Silva"
                disabled={isLoading || success}
                minLength={3}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="seu@email.com"
                disabled={isLoading || success}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="••••••••"
                disabled={isLoading || success}
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirme a senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="••••••••"
                disabled={isLoading || success}
                minLength={6}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || success}
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link href="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          {/* Link para Login */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Já tem uma conta?{' '}
            </span>
            <Link
              href="/entrar"
              className="text-primary font-semibold hover:underline"
            >
              Faça login
            </Link>
          </div>
        </div>

        {/* Link para Voltar */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar para a home
          </Link>
        </div>
      </div>
    </div>
  );
}
