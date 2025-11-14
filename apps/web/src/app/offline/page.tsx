import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WifiOff } from 'lucide-react';
import { Button } from '@thebeautypro/ui/button';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center">
            <WifiOff className="h-24 w-24 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Você está offline</h1>
          <p className="mt-2 text-muted-foreground">
            Não foi possível conectar à internet.
          </p>
          <p className="text-sm text-muted-foreground">
            Verifique sua conexão e tente novamente.
          </p>
          <Button
            className="mt-6"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
