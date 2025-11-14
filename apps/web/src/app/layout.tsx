import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { CartProvider } from '@/contexts/cart-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Beauty Pro - Marketplace de Beleza',
  description:
    'O ecossistema digital definitivo para a indústria da beleza. Compre e venda produtos, cursos presenciais e online.',
  keywords: ['beleza', 'marketplace', 'cursos', 'produtos', 'maquiagem', 'cabelo'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
