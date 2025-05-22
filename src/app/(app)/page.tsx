
'use client';

import { useState, useEffect } from 'react';
import RoomRedesignForm from '@/components/RoomRedesignForm';
import RedesignPreview from '@/components/RedesignPreview';
import { redesignRoom } from '@/ai/flows/redesign-room';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StyleMyRoomPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [redesignedImage, setRedesignedImage] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<string>('');
  const [isLoadingRedesign, setIsLoadingRedesign] = useState(false);
  const { toast } = useToast();
  const { 
    user, 
    addFavorite, 
    favorites, 
    canUserRedesign, 
    recordRedesignAttempt, 
    remainingRedesignsToday 
  } = useAuth();

  // Derived state for whether user can submit a redesign
  const [allowRedesign, setAllowRedesign] = useState(false);

  useEffect(() => {
    if(user){ // only check if user is loaded
        setAllowRedesign(canUserRedesign());
    }
  }, [user, canUserRedesign, remainingRedesignsToday]);


  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Logged In", description: "Please log in to redesign rooms." });
      return;
    }
    if (!allowRedesign) {
      toast({
        variant: "destructive",
        title: "Daily Limit Reached",
        description: "You've used all your redesigns for today. Please try again tomorrow.",
      });
      return;
    }

    setIsLoadingRedesign(true);
    setOriginalImage(photoDataUri);
    setRedesignedImage(null);
    setCurrentStyle(style);

    try {
      const result = await redesignRoom({ photoDataUri, style });
      if (result.redesignedPhotoDataUri) {
        setRedesignedImage(result.redesignedPhotoDataUri);
        recordRedesignAttempt(); // Record successful attempt
        setAllowRedesign(canUserRedesign()); // Re-check limit after recording
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
      setRedesignedImage(null); // Clear redesigned image on failure
    } finally {
      setIsLoadingRedesign(false);
    }
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      const favoriteTitle = `My ${currentStyle} Room`;
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
          StyleMyRoom AI Designer
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
          Upload a photo, pick a style, and let our AI transform your space!
        </p>
      </div>

      {user && (
        <Alert className="max-w-2xl mx-auto bg-accent/30 border-accent/50">
          <Info className="h-5 w-5 text-accent-foreground" />
          <AlertTitle className="font-semibold text-accent-foreground">Daily Redesigns Remaining: {remainingRedesignsToday}</AlertTitle>
          <AlertDescription className="text-accent-foreground/80">
            {remainingRedesignsToday > 0 
              ? `You can redesign ${remainingRedesignsToday} more room${remainingRedesignsToday === 1 ? '' : 's'} today.`
              : "You've reached your daily redesign limit. Check back tomorrow!"}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <RoomRedesignForm 
            onSubmit={handleRedesignSubmit} 
            isLoading={isLoadingRedesign} 
            isSubmitDisabled={!allowRedesign || isLoadingRedesign}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <RedesignPreview
            originalImageSrc={originalImage}
            redesignedImageSrc={redesignedImage}
            isLoading={isLoadingRedesign}
          />
          {user && redesignedImage && !isLoadingRedesign && (
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
