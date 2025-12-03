'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, Heart } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';
import { UserMenu } from './user-menu';
import { MobileMenu } from './mobile-menu';
import { NotificationsDropdown } from './notifications-dropdown';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';

export function Header() {
  const router = useRouter();
  const { itemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="relative"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos ou cursos..."
                className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </form>
          </div>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/lista-desejos">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
              <span className="sr-only">Lista de Desejos ({wishlistItems.length})</span>
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {itemsCount}
                </span>
              )}
              <span className="sr-only">Carrinho ({itemsCount})</span>
            </Link>
          </Button>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* User Menu */}
          <UserMenu />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

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
