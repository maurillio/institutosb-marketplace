'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Settings, Package, ShoppingBag, GraduationCap } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import { useState, useRef, useEffect } from 'react';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (!session) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/entrar">
          <User className="h-5 w-5" />
          <span className="sr-only">Entrar</span>
        </Link>
      </Button>
    );
  }

  const isVendedor = session.user.roles.includes('SELLER');
  const isInstrutor = session.user.roles.includes('INSTRUCTOR');
  const isAdmin = session.user.roles.includes('ADMIN');

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        {session.user.avatar ? (
          <img
            src={session.user.avatar}
            alt={session.user.name}
            className="h-8 w-8 rounded-full object-cover border-2 border-primary"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
            {session.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">
          {session.user.name.split(' ')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card rounded-md shadow-lg border border-border py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/minha-conta"
              className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Minha Conta</span>
            </Link>

            <Link
              href="/meus-pedidos"
              className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Meus Pedidos</span>
            </Link>

            <Link
              href="/meus-cursos"
              className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Meus Cursos</span>
            </Link>

            {(isVendedor || isInstrutor || isAdmin) && (
              <>
                <div className="my-2 border-t border-border"></div>

                {isVendedor && (
                  <Link
                    href="/dashboard/vendedor"
                    className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>Dashboard Vendedor</span>
                  </Link>
                )}

                {isInstrutor && (
                  <Link
                    href="/dashboard/instrutor"
                    className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Dashboard Instrutor</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Administração</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-border mt-2 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors w-full text-left text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
