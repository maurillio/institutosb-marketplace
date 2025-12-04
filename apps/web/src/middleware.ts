import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting simples usando Map (em produção, usar Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configurações de rate limit por tipo de rota
const RATE_LIMITS = {
  api: {
    windowMs: 60 * 1000, // 1 minuto
    max: 1000, // 1000 requests por minuto (aumentado)
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // 50 tentativas (aumentado)
  },
  upload: {
    windowMs: 60 * 1000, // 1 minuto
    max: 50, // 50 uploads por minuto (aumentado)
  },
};

function getRateLimitKey(request: any): string {
  // Usar IP do cliente
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return ip;
}

function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/auth/')) {
    return RATE_LIMITS.auth;
  }
  if (pathname.startsWith('/api/upload')) {
    return RATE_LIMITS.upload;
  }
  if (pathname.startsWith('/api/')) {
    return RATE_LIMITS.api;
  }
  return null;
}

function checkRateLimit(key: string, config: { windowMs: number; max: number }): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true;
  }

  if (record.count >= config.max) {
    return false;
  }

  record.count++;
  return true;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Rate limiting para APIs
    if (path.startsWith('/api/')) {
      const config = getRateLimitConfig(path);

      if (config) {
        const key = `${path}:${getRateLimitKey(req)}`;
        const allowed = checkRateLimit(key, config);

        if (!allowed) {
          console.log('[RateLimit] ❌ Limite excedido:', path);
          return NextResponse.json(
            {
              error: 'Muitas requisições. Tente novamente em alguns instantes.',
              retryAfter: Math.ceil(config.windowMs / 1000),
            },
            {
              status: 429,
              headers: {
                'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
                'X-RateLimit-Limit': config.max.toString(),
                'X-RateLimit-Remaining': '0',
              },
            }
          );
        }
      }

      // Cleanup periódico
      if (Math.random() < 0.01) {
        const now = Date.now();
        for (const [key, record] of rateLimitMap.entries()) {
          if (now > record.resetTime) {
            rateLimitMap.delete(key);
          }
        }
      }
    }

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
