'use client';

import { useState } from 'react';
import RoomRedesignForm from '@/components/RoomRedesignForm';
import RedesignPreview from '@/components/RedesignPreview';
import { redesignRoom } from '@/ai/flows/redesign-room';
import { useToast } from '@/hooks/use-toast';

export default function StyleMyRoomPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [redesignedImage, setRedesignedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    setIsLoading(true);
    setOriginalImage(photoDataUri); // Show original image in preview immediately
    setRedesignedImage(null); // Clear previous redesign

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
        <div className="lg:col-span-2">
          <RedesignPreview
            originalImageSrc={originalImage}
            redesignedImageSrc={redesignedImage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
