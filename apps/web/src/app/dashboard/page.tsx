'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/entrar');
      return;
    }

    // Redirect baseado nas roles do usuário
    const roles = session.user.roles || [];

    if (roles.includes('ADMIN')) {
      router.push('/admin');
    } else if (roles.includes('SELLER')) {
      router.push('/dashboard/vendedor');
    } else if (roles.includes('INSTRUCTOR')) {
      router.push('/dashboard/instrutor');
    } else {
      router.push('/perfil');
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 flex items-center justify-center">
        <p>Redirecionando...</p>
      </main>
      <Footer />
    </div>
  );
}
