
'use client';

import { useAuth } from '@/hooks/useAuth';
import DesignCard from '@/components/DesignCard';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Share2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function FavoritesPage() {
  const { favorites, removeFavorite, user, isLoading } = useAuth();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading favorites..." size={16} /></div>;
  }

  if (!user) {
    return (
       <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need to be logged in to view your favorites.
            <Link href="/auth/signin" className="text-primary hover:underline ml-1">Sign In</Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleShareFavorite = (imageUrl: string, title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out this room redesign: ${title}! Image: ${imageUrl}`)
        .then(() => {
          toast({ title: "Link Copied!", description: "Redesign info copied to clipboard." });
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
        });
    } else {
      toast({ variant: "destructive", title: "Clipboard Error", description: "Clipboard access not available." });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-primary" /> My Favorite Redesigns
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
          Your personal collection of inspiring room transformations.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="relative group">
              <DesignCard
                id={fav.id}
                imageUrl={fav.redesignedImage} 
                title={fav.title || `Redesign in ${fav.style}`}
                userName={user.name || user.email || "You"}
                likes={0} 
                comments={0}
                dataAiHint="redesigned room"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handleShareFavorite(fav.redesignedImage, fav.title || `Redesign in ${fav.style}`)}
                  aria-label="Share design"
                  className="bg-primary/80 hover:bg-primary text-primary-foreground"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeFavorite(fav.id)}
                  aria-label="Remove from favorites"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-2xl font-semibold text-muted-foreground mb-2">No favorites yet!</p>
          <p className="text-muted-foreground mb-6">Start redesigning and save your best creations.</p>
          <Link href="/" passHref legacyBehavior>
            <Button size="lg">
              Redesign a Room
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
