import Link from 'next/link';
import { Button } from '@thebeautypro/ui/button';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            O Marketplace Definitivo
            <span className="text-primary"> da Beleza</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Descubra produtos incríveis, aprenda com os melhores cursos e
            transforme sua paixão pela beleza em negócio.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/produtos">Explorar Produtos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/cursos">Ver Cursos</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">10k+</p>
              <p className="text-sm text-muted-foreground">Produtos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Cursos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50k+</p>
              <p className="text-sm text-muted-foreground">Usuários</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
