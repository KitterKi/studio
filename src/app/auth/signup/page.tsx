
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Card import was missing
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APP_NAME } from '@/lib/constants'; // Importado APP_NAME


export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
     if (!email || !password || !name) {
       toast({ variant: "destructive", title: "Campos faltantes", description: "Por favor, completa todos los campos requeridos." });
      return;
    }
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Contraseña muy corta", description: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    try {
      await signup(email, password, name);
    } catch (error: any) {
      let errorMessage = "Ocurrió un error inesperado.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast({ variant: "destructive", title: "Falló el Registro", description: errorMessage });
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
            <Label htmlFor="email">Correo Electrónico</Label>
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
            {isLoading ? 'Creando Cuenta...' : 'Registrarse'}
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
// Removed local const APP_NAME = "StyleMyRoom";
