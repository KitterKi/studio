
// src/app/(app)/u/[username]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getMockUserProfileByUsername, type MockUserProfile } from '@/lib/mock-public-profiles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle, Grid3x3, Heart, MessageCircle, Settings, UserPlus, Check } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const ProfileNotFound = () => (
  <div className="text-center py-12">
    <UserCircle className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
    <h2 className="text-2xl font-semibold mb-2">Perfil no encontrado</h2>
    <p className="text-muted-foreground mb-6">
      Lo sentimos, no pudimos encontrar el perfil de este usuario.
    </p>
    <Link href="/community">
      <Button variant="outline">Volver a la Comunidad</Button>
    </Link>
  </div>
);

export default function UserProfilePage() {
  const params = useParams();
  const usernameParam = typeof params.username === 'string' ? decodeURIComponent(params.username) : '';
  const userProfileData = getMockUserProfileByUsername(usernameParam);
  const router = useRouter();

  const { user: loggedInUser, isFollowing, toggleFollow } = useAuth();
  const [isCurrentlyFollowing, setIsCurrentlyFollowing] = useState(false);
  const [displayFollowersCount, setDisplayFollowersCount] = useState(0);

  useEffect(() => {
    if (userProfileData) {
      setDisplayFollowersCount(userProfileData.followersCount);
      if (loggedInUser) {
        setIsCurrentlyFollowing(isFollowing(userProfileData.username));
      } else {
        setIsCurrentlyFollowing(false); 
      }
    }
  }, [userProfileData, loggedInUser, isFollowing]);

  if (!userProfileData) {
    return <ProfileNotFound />;
  }

  const { username, avatarUrl, postsCount, followingCount: initialFollowingCount, bio, posts } = userProfileData;

  const handleToggleFollow = () => {
    if (!loggedInUser || !userProfileData) {
      router.push('/auth/signin'); // Redirect to sign-in if not logged in
      return;
    }

    const wasFollowing = isCurrentlyFollowing;
    toggleFollow(userProfileData.username); 
    setIsCurrentlyFollowing(!wasFollowing);
    setDisplayFollowersCount(prevCount => !wasFollowing ? prevCount + 1 : prevCount -1);
  };


  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + (parts[parts.length - 1][0] || parts[0][1] || '')).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 border-b pb-8">
        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 ring-4 ring-primary/30 ring-offset-background ring-offset-2 shrink-0">
          <AvatarImage
            src={avatarUrl}
            alt={`Avatar de ${username}`}
            data-ai-hint="profile large"
          />
          <AvatarFallback className="text-5xl">{getInitials(username)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center sm:items-start space-y-3 flex-grow">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <h1 className="text-3xl font-light text-foreground truncate">{username}</h1>
            {/* Check if the logged-in user is viewing their own public profile stub. If so, don't show follow button.
                This assumes loggedInUser.name might match a mock profile username.
            */}
            {loggedInUser && loggedInUser.name !== username && (
              <div className="flex gap-2">
                <Button
                  variant={isCurrentlyFollowing ? "secondary" : "default"}
                  size="sm"
                  onClick={handleToggleFollow}
                >
                  {isCurrentlyFollowing ? <Check className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {isCurrentlyFollowing ? "Siguiendo" : "Seguir"}
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Mensaje
                </Button>
              </div>
            )}
             {!loggedInUser && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleToggleFollow} // Will redirect to signin if no user
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Seguir
                </Button>
             )}
             <Button variant="ghost" size="icon" className="sm:hidden" disabled title="Más opciones">
                <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-4 sm:gap-6 pt-2 text-center sm:text-left">
            <div>
              <span className="font-semibold text-lg">{postsCount}</span>
              <span className="text-muted-foreground ml-1">publicaciones</span>
            </div>
            <div>
              <span className="font-semibold text-lg">{displayFollowersCount.toLocaleString()}</span>
              <span className="text-muted-foreground ml-1">seguidores</span>
            </div>
            <div>
              <span className="font-semibold text-lg">{initialFollowingCount.toLocaleString()}</span>
              <span className="text-muted-foreground ml-1">siguiendo</span>
            </div>
          </div>
          {bio && (
            <p className="text-sm text-foreground pt-1 text-center sm:text-left max-w-md">
              {bio}
            </p>
          )}
          <p className="text-xs text-muted-foreground pt-1 text-center sm:text-left">
            Explorando diseños en {APP_NAME}.
          </p>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-center gap-4 border-t pt-2">
          <Button variant="ghost" className="text-primary border-b-2 border-primary h-12">
            <Grid3x3 className="mr-2 h-4 w-4" /> PUBLICACIONES
          </Button>
          <Button variant="ghost" className="text-muted-foreground h-12" disabled>
            <Heart className="mr-2 h-4 w-4" /> GUARDADO (Próximamente)
          </Button>
        </div>

        {posts.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2 mt-6">
            {posts.map((post) => (
              <Link
                href={`/community?openDesignId=${post.id}`}
                key={post.id}
                className="group relative aspect-square overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                title={`Ver detalles de la publicación de ${username}`}
              >
                <Image
                  src={post.imageUrl}
                  alt={`Publicación de ${username}: ${post.id}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={post.dataAiHint || "diseño interior"}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2">
                  <div className="text-white text-sm sm:text-base text-center flex items-center gap-2 sm:gap-4">
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-white" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 fill-white" /> {post.comments}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mt-6 border-2 border-dashed border-muted rounded-lg">
            <Grid3x3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground mb-2">Este usuario aún no tiene publicaciones.</p>
          </div>
        )}
      </section>
    </div>
  );
}
