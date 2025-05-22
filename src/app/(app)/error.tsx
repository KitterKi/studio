
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center flex-grow py-12">
      <Card className="w-full max-w-lg text-center shadow-2xl bg-card">
        <CardHeader className="pb-4">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold text-destructive">
            ¡Ups! Algo salió mal
          </CardTitle>
          <CardDescription className="text-lg text-card-foreground/80">
            Lo sentimos, pero ocurrió un error inesperado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error?.message && (
            <p className="text-sm bg-destructive/10 p-3 rounded-md text-destructive border border-destructive/20">
              <strong>Detalles del error:</strong> {error.message}
            </p>
          )}
           <p className="mt-4 text-sm text-card-foreground/70">
            Puedes intentar actualizar la página o hacer clic en el botón de abajo.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button onClick={() => reset()} variant="destructive" size="lg">
            Intentar de nuevo
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
            Ir a la Página de Inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
