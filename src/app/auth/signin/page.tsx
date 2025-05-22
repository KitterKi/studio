
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { LogIn } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; // Using react-icons for Google icon
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function SignInPage() {
  const { user, signInWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);


  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
          <LogIn className="h-7 w-7" /> Iniciar Sesión
        </CardTitle>
        <CardDescription>Accede a tu cuenta para rediseñar tus espacios.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button 
          variant="outline" 
          className="w-full py-6 text-base" 
          onClick={signInWithGoogle}
          disabled={isLoading}
        >
          {isLoading ? (
            'Iniciando...'
          ) : (
            <>
              <FcGoogle className="mr-3 h-6 w-6" />
              Continuar con Google
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground text-center">
          ¿No tienes una cuenta? Google creará una por ti.
        </p>
         <p className="text-xs text-muted-foreground px-6 text-center">
          Al continuar, aceptas nuestras Condiciones de Servicio y Política de Privacidad (simuladas).
        </p>
      </CardFooter>
    </>
  );
}
