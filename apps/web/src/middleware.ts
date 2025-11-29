import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log('[Middleware] Path:', path, 'Token exists:', !!token);
    console.log('[Middleware] User:', token ? `${token.id} - ${token.name}` : 'none');

    // Proteção de rotas administrativas
    if (path.startsWith('/admin')) {
      if (!token?.roles?.includes('ADMIN')) {
        console.log('[Middleware] ❌ Acesso negado a /admin');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Proteção de dashboards de vendedor
    if (path.startsWith('/dashboard/vendedor')) {
      if (!token?.roles?.includes('SELLER') && !token?.roles?.includes('ADMIN')) {
        console.log('[Middleware] ❌ Acesso negado a /dashboard/vendedor');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Proteção de dashboards de instrutor
    if (path.startsWith('/dashboard/instrutor')) {
      if (!token?.roles?.includes('INSTRUCTOR') && !token?.roles?.includes('ADMIN')) {
        console.log('[Middleware] ❌ Acesso negado a /dashboard/instrutor');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Verificar se o usuário está ativo
    if (token?.status !== 'ACTIVE' && !path.startsWith('/entrar')) {
      console.log('[Middleware] ❌ Usuário inativo, redirecionando para login');
      return NextResponse.redirect(new URL('/entrar?error=AccountInactive', req.url));
    }

    console.log('[Middleware] ✅ Acesso permitido');
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/entrar',
    },
  }
);

// Rotas protegidas que exigem autenticação
export const config = {
  matcher: [
    '/perfil',
    '/minha-conta/:path*',
    '/meus-pedidos/:path*',
    '/meus-cursos/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/checkout/:path*',
  ],
};
