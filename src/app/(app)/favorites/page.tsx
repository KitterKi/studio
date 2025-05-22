
'use client';

import { useState } from 'react';
import type { FavoriteItem } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import DesignCard from '@/components/DesignCard';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Share2, ExternalLink, Info, Search } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { findSimilarItems, type IdentifiedItem } from '@/ai/flows/find-similar-items-flow';

// Chilean Stores for search links
const CHILEAN_STORES = [
  { name: "Falabella", site: "www.falabella.com/falabella-cl" }, // Updated domain
  { name: "Paris", site: "paris.cl" },
  { name: "Ripley", site: "ripley.cl" },
  { name: "Sodimac", site: "sodimac.cl" },
  { name: "Mercado Libre", site: "mercadolibre.cl" },
];

export default function FavoritesPage() {
  const { favorites, removeFavorite, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);
  const [isLoadingSimilarItems, setIsLoadingSimilarItems] = useState(false);
  const [similarItems, setSimilarItems] = useState<IdentifiedItem[]>([]);

  if (authLoading) {
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

  const handleOpenFindItemsModal = async (favorite: FavoriteItem) => {
    setSelectedFavorite(favorite);
    setIsModalOpen(true);
    setIsLoadingSimilarItems(true);
    setSimilarItems([]); 

    try {
      const result = await findSimilarItems({ imageDataUri: favorite.redesignedImage });
      setSimilarItems(result.items);
      if (result.items.length === 0) {
        toast({
          title: "No Distinct Items Found",
          description: "The AI couldn't identify distinct items to search for in this image.",
        });
      }
    } catch (error) {
      console.error("Error finding similar items:", error);
      let errorMessage = "Failed to find similar items. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "AI Error",
        description: errorMessage,
      });
    } finally {
      setIsLoadingSimilarItems(false);
    }
  };
  
  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-primary" /> My Favorite Redesigns
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
            Your personal collection of inspiring room transformations. Click an image to find similar items!
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
                  onImageClick={() => handleOpenFindItemsModal(fav)}
                  isImageClickable={true}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                  {/* Find items button removed from here, click image instead */}
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => handleShareFavorite(fav.redesignedImage, fav.title || `Redesign in ${fav.style}`)}
                    aria-label="Share design"
                    className="bg-primary/80 hover:bg-primary text-primary-foreground"
                    title="Share design"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFavorite(fav.id)}
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
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

      {selectedFavorite && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Find Similar Items for "{selectedFavorite.title}"</DialogTitle>
              <DialogDescription>
                The AI has identified these items. Click to search for them in popular Chilean stores. Results will open in a new tab.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 flex-grow min-h-0">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border self-start">
                <Image
                  src={selectedFavorite.redesignedImage}
                  alt={`Redesigned room: ${selectedFavorite.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>

              <div className="space-y-4 overflow-y-auto overflow-x-hidden pr-2 flex-grow min-h-0"> {/* Added overflow-x-hidden */}
                {isLoadingSimilarItems && (
                  <div className="flex flex-col items-center justify-center h-full py-10">
                    <LoadingSpinner text="AI is identifying items..." size={10}/>
                  </div>
                )}
                {!isLoadingSimilarItems && similarItems.length === 0 && (
                  <Alert className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Nothing Found Yet</AlertTitle>
                    <AlertDescription>
                      The AI could not identify distinct items to search for in this image, or the image might not contain easily identifiable items. Try another image or check back if the AI is still learning.
                    </AlertDescription>
                  </Alert>
                )}
                {!isLoadingSimilarItems && similarItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-card shadow-md space-y-2">
                    <h3 className="font-semibold text-lg text-card-foreground flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary"/>
                      {item.itemName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.itemDescription}</p>
                    <div className="pt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Search on:</p>
                      <div className="flex flex-wrap gap-2">
                        {CHILEAN_STORES.map(store => (
                          <Button
                            key={store.name}
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs text-primary border-primary/50 hover:bg-primary/10"
                          >
                            <a
                              href={`https://www.google.com/search?q=site%3A${store.site}+${encodeURIComponent(item.suggestedSearchQuery)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5"
                            >
                              {store.name} <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
