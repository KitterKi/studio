
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle, Mail, Edit3, Heart, Image as ImageIcon, LogOut, Users, Columns } from 'lucide-react'; // Added Users, Columns
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { Wand2 } from 'lucide-react';


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

  // Mock stats for Instagram look
  const mockFollowers = Math.floor(Math.random() * 1000) + 50;
  const mockFollowing = Math.floor(Math.random() * 500) + 20;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Profile Header */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 border-b pb-8">
        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 ring-4 ring-primary/30 ring-offset-background ring-offset-2 shrink-0">
          <AvatarImage 
            src={`https://placehold.co/160x160.png?text=${getInitials(user.name, user.email)}`} 
            alt={user.name || user.email || 'Avatar de usuario'}
            data-ai-hint="profile large" 
          />
          <AvatarFallback className="text-5xl">{getInitials(user.name, user.email)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center sm:items-start space-y-3 flex-grow">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <h1 className="text-3xl font-light text-foreground truncate">{user.name || 'Usuario Anónimo'}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-center sm:text-left">{user.email}</p>
          
          {/* Stats Section */}
          <div className="flex gap-6 pt-2 text-center sm:text-left">
            <div>
              <span className="font-semibold text-lg">{favorites.length}</span>
              <span className="text-muted-foreground ml-1">publicaciones</span>
            </div>
            <div>
              <span className="font-semibold text-lg">{mockFollowers}</span>
              <span className="text-muted-foreground ml-1">seguidores</span>
            </div>
            <div>
              <span className="font-semibold text-lg">{mockFollowing}</span>
              <span className="text-muted-foreground ml-1">siguiendo</span>
            </div>
          </div>
          <p className="text-sm text-foreground pt-1 text-center sm:text-left">
            Bienvenido a tu espacio en {APP_NAME}. ¡Aquí puedes ver tus creaciones favoritas!
          </p>
        </div>
      </header>

      {/* Gallery Section */}
      <section>
        <div className="flex items-center justify-center gap-4 border-t pt-2">
            <Button variant="ghost" className="text-primary border-b-2 border-primary h-12">
                <Columns className="mr-2 h-4 w-4"/> PUBLICACIONES
            </Button>
            <Button variant="ghost" className="text-muted-foreground h-12" disabled>
                <Heart className="mr-2 h-4 w-4"/> GUARDADO (Próximamente)
            </Button>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4 mt-6">
            {favorites.map((fav) => (
              <Link href="/favorites" key={fav.id} className="group" title={`Ver detalle de "${fav.title || 'Diseño'}" en Favoritos`}>
                <div className="aspect-square relative w-full overflow-hidden hover:opacity-90 transition-opacity duration-200">
                  <Image
                    src={fav.redesignedImage}
                    alt={fav.title || `Diseño ${fav.style}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                    data-ai-hint="favorite design"
                  />
                   <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2">
                      <div className="text-white text-xs text-center flex items-center gap-4">
                        <span className="flex items-center gap-1"><Heart className="h-4 w-4 fill-white"/> {fav.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4 fill-white"/> {fav.comments}</span>
                      </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mt-6 border-2 border-dashed border-muted rounded-lg">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground mb-2">Aún no tienes publicaciones</p>
            <p className="text-muted-foreground mb-6">¡Empieza a rediseñar y guarda tus creaciones para verlas aquí!</p>
            <Link href="/" passHref legacyBehavior>
              <Button size="lg">
                <Wand2 className="mr-2 h-4 w-4" />
                Rediseñar una Habitación
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
