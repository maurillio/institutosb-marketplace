import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteção de rotas administrativas
    if (path.startsWith('/admin')) {
      if (!token?.roles?.includes('ADMIN')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Proteção de dashboards de vendedor
    if (path.startsWith('/dashboard/vendedor')) {
      if (!token?.roles?.includes('SELLER') && !token?.roles?.includes('ADMIN')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Proteção de dashboards de instrutor
    if (path.startsWith('/dashboard/instrutor')) {
      if (!token?.roles?.includes('INSTRUCTOR') && !token?.roles?.includes('ADMIN')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Verificar se o usuário está ativo
    if (token?.status !== 'ACTIVE' && !path.startsWith('/entrar')) {
      return NextResponse.redirect(new URL('/entrar?error=AccountInactive', req.url));
    }

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
    '/minha-conta/:path*',
    '/meus-pedidos/:path*',
    '/meus-cursos/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/checkout/:path*',
  ],
};
