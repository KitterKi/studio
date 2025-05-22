
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APP_NAME } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

 useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
     if (!email || !password || !name) {
       toast({ variant: "destructive", title: "Campos incompletos", description: "Por favor completa todos los campos." });
      return;
    }
    if (password.length < 6 && password !== "1234") { // Allow "1234" for mock consistency
      toast({ variant: "destructive", title: "Contraseña muy corta", description: "La contraseña debe tener al menos 6 caracteres (o ser '1234' para prueba)." });
      return;
    }
    try {
      await signup(name, email, password);
       // Redirection is handled by useEffect or inside signup function
    } catch (error: any) {
      // This catch might not be strictly necessary if signup itself shows toasts
      toast({ variant: "destructive", title: "Falló el Registro", description: error.message || "Ocurrió un error inesperado." });
    }
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
          <UserPlus className="h-7 w-7" /> Crear Cuenta
        </CardTitle>
        <CardDescription>¡Únete a {APP_NAME} hoy!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="•••••••• (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </Button>
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </>
  );
}
