import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { CartProvider } from '@/contexts/cart-context';
import { WishlistProvider } from '@/contexts/wishlist-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Beauty Pro - Marketplace de Beleza',
  description:
    'O ecossistema digital definitivo para a indústria da beleza. Compre e venda produtos, cursos presenciais e online.',
  keywords: ['beleza', 'marketplace', 'cursos', 'produtos', 'maquiagem', 'cabelo'],
  manifest: '/manifest.json',
  themeColor: '#db2777',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Beauty Pro',
  },
  applicationName: 'The Beauty Pro',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'The Beauty Pro',
    title: 'The Beauty Pro - Marketplace de Beleza',
    description:
      'O ecossistema digital definitivo para a indústria da beleza. Compre e venda produtos, cursos presenciais e online.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Beauty Pro - Marketplace de Beleza',
    description:
      'O ecossistema digital definitivo para a indústria da beleza. Compre e venda produtos, cursos presenciais e online.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
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
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
