'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';
import { CheckCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Link inválido');
      setLoading(false);
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao verificar email');
        toast.error(data.error || 'Erro ao verificar email');
        return;
      }

      if (data.alreadyVerified) {
        setAlreadyVerified(true);
        toast.info('Email já verificado anteriormente');
      } else {
        setSuccess(true);
        toast.success('Email verificado com sucesso!');
      }

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao verificar email');
      toast.error('Erro ao verificar email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white p-8 shadow-sm text-center">
            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Verificando Email...</h2>
            <p className="text-muted-foreground mt-2">
              Aguarde enquanto verificamos seu email
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 text-center">Erro na Verificação</h2>
            <p className="mt-3 text-sm text-muted-foreground text-center">
              {error}
            </p>

            <div className="mt-6 space-y-3">
              <Button asChild className="w-full">
                <Link href="/entrar">Ir para Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Voltar para Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (alreadyVerified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 text-center">Email Já Verificado</h2>
            <p className="mt-3 text-sm text-muted-foreground text-center">
              Seu email já foi verificado anteriormente. Você já pode usar todos os recursos da plataforma!
            </p>

            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="/">Ir para Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 text-center">Email Verificado!</h2>
            <p className="mt-3 text-sm text-muted-foreground text-center">
              Sua conta foi ativada com sucesso. Agora você pode aproveitar todos os recursos da The Beauty Pro!
            </p>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-900 font-medium">
                Você já pode:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-800 list-disc list-inside">
                <li>Comprar produtos</li>
                <li>Se matricular em cursos</li>
                <li>Tornar-se vendedor ou instrutor</li>
                <li>Gerenciar seus pedidos e matrículas</li>
              </ul>
            </div>

            <p className="mt-4 text-sm text-muted-foreground text-center">
              Você será redirecionado para a home em alguns segundos...
            </p>

            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="/">Ir para Home Agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p>Carregando...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
