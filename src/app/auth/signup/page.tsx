
'use client';

import Link from 'next/link';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/lib/constants';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
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
          <UserPlus className="h-7 w-7" /> Crear Cuenta
        </CardTitle>
        <CardDescription>¡Únete a {APP_NAME} hoy! La forma más fácil es con Google.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <Button 
          variant="outline" 
          className="w-full py-6 text-base" 
          onClick={signInWithGoogle}
          disabled={isLoading}
        >
          {isLoading ? (
            'Creando cuenta...'
          ) : (
            <>
              <FcGoogle className="mr-3 h-6 w-6" />
              Registrarse con Google
            </>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Iniciar Sesión
            </Link>
          </p>
      </CardContent>
       <CardFooter>
        <p className="text-xs text-muted-foreground px-2 text-center">
           Al registrarte, aceptas nuestras Condiciones de Servicio y Política de Privacidad (simuladas).
        </p>
      </CardFooter>
    </>
  );
}
