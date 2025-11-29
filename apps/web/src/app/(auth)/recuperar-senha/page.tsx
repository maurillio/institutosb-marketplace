'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // TODO: Implementar API de recuperação de senha
      // Por enquanto, apenas simula o envio
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao enviar email de recuperação. Tente novamente.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <h1 className="text-3xl font-bold text-primary">The Beauty Pro</h1>
              </Link>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-center">
                Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/entrar"
                className="text-primary hover:underline"
              >
                Voltar para login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Recuperar senha
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-6">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          {/* Instruções */}
          <p className="text-sm text-muted-foreground text-center mb-6">
            Digite seu email e enviaremos instruções para redefinir sua senha.
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar email de recuperação'}
            </Button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Lembrou sua senha?{' '}
              <Link
                href="/entrar"
                className="text-primary font-medium hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
