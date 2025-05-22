
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserCircle, Mail, Edit3, Heart, Image as ImageIcon, BarChart3 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image

export default function ProfilePage() {
  const { user, isLoading, logout, favorites } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Cargando perfil..." size={16} /></div>;
  }

  if (!user) {
     return (
       <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            Necesitas iniciar sesión para ver tu perfil.
             <Link href="/auth/signin" className="text-primary hover:underline ml-1">Iniciar Sesión</Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    if (email) return email.substring(0,2).toUpperCase();
    return 'U';
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <UserCircle className="h-10 w-10 text-primary" /> Mi Perfil
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">Administra los detalles de tu cuenta y revisa tu actividad.</p>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
           <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/50 ring-offset-background ring-offset-2">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name, user.email)}`} alt={user.name || user.email || 'Avatar de usuario'} data-ai-hint="profile large"/>
            <AvatarFallback className="text-3xl">{getInitials(user.name, user.email)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.name || 'Usuario'}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" /> Nombre
            </Label>
            <Input id="name" value={user.name || ''} readOnly disabled className="bg-muted/30"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" /> Correo Electrónico
            </Label>
            <Input id="email" type="email" value={user.email || ''} readOnly disabled className="bg-muted/30"/>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="w-full" disabled>
              <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil (Próximamente)
            </Button>
            <Button variant="destructive" onClick={logout} className="w-full">
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5 text-primary" />
            Mis Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-lg">
            <Heart className="h-6 w-6 text-destructive" />
            <span>Diseños Guardados:</span>
            <span className="font-bold text-primary">{favorites.length}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ImageIcon className="h-5 w-5 text-primary" />
            Mi Galería de Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {favorites.slice(0, 8).map((fav) => ( // Show up to 8 favorites for brevity
                <Link href="/favorites" key={fav.id} className="group" title={`Ver detalle de "${fav.title}" en Favoritos`}>
                  <div className="aspect-square relative w-full rounded-md overflow-hidden border shadow-md hover:shadow-lg transition-shadow duration-200 group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 ring-offset-background">
                    <Image
                      src={fav.redesignedImage}
                      alt={fav.title || `Diseño ${fav.style}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover"
                      data-ai-hint="favorite design"
                    />
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-xs text-center p-1 bg-black/50 rounded-sm">Ver en Favoritos</span>
                      </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Aún no has guardado ningún diseño favorito.</p>
              <Link href="/" passHref legacyBehavior>
                <Button variant="default">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Empezar a Rediseñar
                </Button>
              </Link>
            </div>
          )}
           {favorites.length > 8 && (
             <div className="mt-6 text-center">
                <Link href="/favorites" passHref legacyBehavior>
                    <Button variant="outline">
                        Ver Todos Mis Favoritos ({favorites.length})
                    </Button>
                </Link>
             </div>
           )}
        </CardContent>
      </Card>

    </div>
  );
}
