'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor, insira seu email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erro ao processar solicitação');
        return;
      }

      setEmailSent(true);
      toast.success('Email enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Voltar */}
        <Link
          href="/entrar"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para login
        </Link>

        <div className="rounded-lg border bg-white p-8 shadow-sm">
          {!emailSent ? (
            <>
              {/* Cabeçalho */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Recuperar Senha</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Insira seu email e enviaremos um link para redefinir sua senha
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    disabled={loading}
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>
              </form>

              {/* Links */}
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Lembrou a senha? </span>
                <Link href="/entrar" className="font-medium text-primary hover:underline">
                  Fazer login
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Sucesso */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900">Email Enviado!</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Se o email <strong>{email}</strong> estiver cadastrado, você receberá um link
                  para redefinir sua senha.
                </p>

                <div className="mt-6 rounded-lg bg-blue-50 p-4 text-left">
                  <p className="text-sm text-blue-900">
                    <strong>Próximos passos:</strong>
                  </p>
                  <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-blue-800">
                    <li>Verifique sua caixa de entrada</li>
                    <li>Abra o email da The Beauty Pro</li>
                    <li>Clique no link para redefinir sua senha</li>
                    <li>O link expira em 1 hora</li>
                  </ol>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  Não recebeu o email? Verifique sua pasta de spam ou
                </p>
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="mt-2"
                >
                  Tentar Novamente
                </Button>

                <div className="mt-8 pt-6 border-t">
                  <Link href="/entrar" className="text-sm font-medium text-primary hover:underline">
                    Voltar para login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Informação de Segurança */}
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <p className="text-center text-xs text-muted-foreground">
            🔒 Por questões de segurança, não informamos se o email está cadastrado em nossa
            plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
