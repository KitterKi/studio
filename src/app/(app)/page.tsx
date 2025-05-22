
'use client';

import { useState } from 'react';
import RoomRedesignForm from '@/components/RoomRedesignForm';
import RedesignPreview from '@/components/RedesignPreview';
import { redesignRoom } from '@/ai/flows/redesign-room';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function StyleMyRoomPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [redesignedImage, setRedesignedImage] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, addFavorite, favorites } = useAuth();

  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    setIsLoading(true);
    setOriginalImage(photoDataUri);
    setRedesignedImage(null);
    setCurrentStyle(style);

    try {
      const result = await redesignRoom({ photoDataUri, style });
      if (result.redesignedPhotoDataUri) {
        setRedesignedImage(result.redesignedPhotoDataUri);
        toast({
          title: "Redesign Complete!",
          description: "Your room has been successfully redesigned.",
        });
      } else {
        throw new Error("AI did not return an image.");
      }
    } catch (error) {
      console.error("Error redesigning room:", error);
      let errorMessage = "Failed to redesign the room. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Redesign Failed",
        description: errorMessage,
      });
      setRedesignedImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      const favoriteTitle = `My ${currentStyle} Room`; // Or prompt user for a title
      addFavorite({
        originalImage,
        redesignedImage,
        title: favoriteTitle,
        style: currentStyle,
      });
      toast({
        title: "Added to Favorites!",
        description: `${favoriteTitle} has been saved.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Cannot save favorite",
        description: "Ensure you have a redesigned image and are logged in.",
      });
    }
  };
  
  const isAlreadyFavorite = redesignedImage && favorites.some(fav => fav.redesignedImage === redesignedImage);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Welcome to StyleMyRoom
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
          Transform your space with the power of AI. Upload a photo, pick a style, and let us inspire you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <RoomRedesignForm onSubmit={handleRedesignSubmit} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <RedesignPreview
            originalImageSrc={originalImage}
            redesignedImageSrc={redesignedImage}
            isLoading={isLoading}
          />
          {user && redesignedImage && !isLoading && (
            <div className="text-center">
              <Button 
                onClick={handleSaveFavorite} 
                disabled={isAlreadyFavorite}
                size="lg"
                className="w-full max-w-xs mx-auto"
              >
                <Heart className={`mr-2 h-5 w-5 ${isAlreadyFavorite ? 'fill-destructive text-destructive' : ''}`} />
                {isAlreadyFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
