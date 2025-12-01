'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Home, Package, GraduationCap, Grid3x3, Store, HelpCircle, Mail } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import { useSession } from 'next-auth/react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/produtos', label: 'Produtos', icon: Package },
    { href: '/cursos', label: 'Cursos', icon: GraduationCap },
    { href: '/categorias', label: 'Categorias', icon: Grid3x3 },
    { href: '/vender', label: 'Vender na Beauty Pro', icon: Store },
    { href: '/contato', label: 'Contato', icon: Mail },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm border-l bg-background p-6 shadow-lg animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Separator */}
        <div className="my-6 border-t" />

        {/* User Section */}
        {session ? (
          <div className="space-y-2">
            <Link
              href="/perfil"
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Meu Perfil
            </Link>
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/meus-pedidos"
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Meus Pedidos
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/entrar" onClick={onClose}>
              <Button className="w-full">Entrar</Button>
            </Link>
            <Link href="/cadastro" onClick={onClose}>
              <Button variant="outline" className="w-full">
                Cadastrar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
