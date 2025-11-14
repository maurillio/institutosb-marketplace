'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import { UserMenu } from './user-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">The Beauty Pro</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            href="/produtos"
            className="transition-colors hover:text-primary"
          >
            Produtos
          </Link>
          <Link
            href="/cursos"
            className="transition-colors hover:text-primary"
          >
            Cursos
          </Link>
          <Link
            href="/categorias"
            className="transition-colors hover:text-primary"
          >
            Categorias
          </Link>
        </nav>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar produtos ou cursos..."
                className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Link>
          </Button>

          {/* User Menu */}
          <UserMenu />

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Secondary Nav - Vender */}
      <div className="border-t">
        <div className="container flex h-10 items-center justify-between text-sm">
          <Link
            href="/vender"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Quero vender na Beauty Pro
          </Link>
        </div>
      </div>
    </header>
  );
}
