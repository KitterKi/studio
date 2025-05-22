
// For now, this is a very basic public profile page stub.
// It doesn't yet display user-specific designs from the community feed
// as our mock data structure doesn't support that easily.

'use client';

import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const username = typeof params.username === 'string' ? decodeURIComponent(params.username) : 'Usuario Desconocido';

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <UserCircle className="h-10 w-10 text-primary" /> Perfil de Usuario
        </h1>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="items-center text-center border-b pb-6">
          <Avatar className="h-28 w-28 mb-4 ring-4 ring-primary/50 ring-offset-background ring-offset-2">
            <AvatarImage 
              src={`https://placehold.co/120x120.png?text=${getInitials(username)}`} 
              alt={`Avatar de ${username}`}
              data-ai-hint="profile large" 
            />
            <AvatarFallback className="text-4xl">{getInitials(username)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">{username}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Más detalles y diseños de este usuario aparecerán aquí en el futuro.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
