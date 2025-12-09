import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo e Descrição */}
          <div className="space-y-3">
            <img
              src="/images/logo.png"
              alt="The Beauty Pro"
              className="h-16 w-auto"
            />
            <p className="text-sm text-muted-foreground">
              O ecossistema digital definitivo para a indústria da beleza.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Marketplace */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/produtos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/cursos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Categorias
                </Link>
              </li>
              <li>
                <Link
                  href="/novidades"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Novidades
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Vendedores */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Para Vendedores</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/vender"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Começar a vender
                </Link>
              </li>
              <li>
                <Link
                  href="/planos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Planos e preços
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/ajuda-vendedor"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/sobre"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 The Beauty Pro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
