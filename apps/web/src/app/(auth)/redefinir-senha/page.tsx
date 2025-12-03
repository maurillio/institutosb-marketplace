'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@thebeautypro/ui/button';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verificar se há token
  useEffect(() => {
    if (!token) {
      toast.error('Link inválido');
      router.push('/recuperar-senha');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erro ao redefinir senha');
        return;
      }

      setSuccess(true);
      toast.success('Senha redefinida com sucesso!');

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/entrar');
      }, 3000);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div className="rounded-lg border bg-white p-8 shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-900">Link Inválido</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                O link de recuperação é inválido ou expirou.
              </p>
              <Button asChild className="mt-6">
                <Link href="/recuperar-senha">Solicitar Novo Link</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            {!success ? (
              <>
                {/* Cabeçalho */}
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Nova Senha</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Escolha uma senha forte para proteger sua conta
                  </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nova Senha */}
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        disabled={loading}
                        className="h-10 w-full rounded-md border border-input bg-white px-3 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Digite a senha novamente"
                        disabled={loading}
                        className="h-10 w-full rounded-md border border-input bg-white px-3 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Validações */}
                  <div className="rounded-lg bg-gray-50 p-3 text-xs text-muted-foreground">
                    <p className="font-medium">Sua senha deve ter:</p>
                    <ul className="mt-1 space-y-1">
                      <li className={password.length >= 6 ? 'text-green-600' : ''}>
                        ✓ Mínimo de 6 caracteres
                      </li>
                      <li className={password === confirmPassword && password ? 'text-green-600' : ''}>
                        ✓ Senhas coincidem
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Sucesso */}
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-900">Senha Redefinida!</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Sua senha foi alterada com sucesso.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Você será redirecionado para a página de login em alguns segundos...
                  </p>

                  <Button asChild className="mt-6">
                    <Link href="/entrar">Ir para Login Agora</Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Informação de Segurança */}
          <div className="mt-4 rounded-lg bg-gray-100 p-4">
            <p className="text-center text-xs text-muted-foreground">
              🔒 Sua senha é criptografada e nunca compartilhada com terceiros.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
