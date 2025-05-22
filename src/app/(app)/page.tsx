
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
import { APP_NAME } from '@/lib/constants';

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

  const [allowRedesign, setAllowRedesign] = useState(false);

  useEffect(() => {
    if(user){ 
        setAllowRedesign(canUserRedesign());
    }
  }, [user, canUserRedesign, remainingRedesignsToday]);


  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "No Has Iniciado Sesión", description: "Por favor, inicia sesión para rediseñar habitaciones." });
      return;
    }
    if (!allowRedesign) {
      toast({
        variant: "destructive",
        title: "Límite Diario Alcanzado",
        description: "Has usado todos tus rediseños por hoy. Por favor, inténtalo de nuevo mañana.",
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
        recordRedesignAttempt(); 
        setAllowRedesign(canUserRedesign()); 
        toast({
          title: "¡Rediseño Completo!",
          description: "Tu habitación ha sido rediseñada exitosamente.",
        });
      } else {
        throw new Error("La IA no devolvió una imagen.");
      }
    } catch (error) {
      console.error("Error rediseñando la habitación:", error);
      let errorMessage = "Falló el rediseño de la habitación. Por favor, inténtalo de nuevo.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Falló el Rediseño",
        description: errorMessage,
      });
      setRedesignedImage(null); 
    } finally {
      setIsLoadingRedesign(false);
    }
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      const favoriteTitle = `Mi Habitación ${currentStyle}`;
      addFavorite({
        originalImage, 
        redesignedImage,
        title: favoriteTitle,
        style: currentStyle,
      });
      toast({
        title: "¡Añadido a Favoritos!",
        description: `${favoriteTitle} ha sido guardado.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "No se puede guardar el favorito",
        description: "Asegúrate de tener una imagen rediseñada y haber iniciado sesión.",
      });
    }
  };
  
  const isAlreadyFavorite = redesignedImage && favorites.some(fav => fav.redesignedImage === redesignedImage);

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
          Diseñador IA {APP_NAME}
        </h1>
        <p className="text-md text-muted-foreground lg:text-lg max-w-2xl mx-auto">
          Transforma tu espacio: sube una foto, elige un estilo ¡y deja que la IA haga su magia!
        </p>
      </div>

      {user && (
        <Alert className="max-w-lg mx-auto bg-accent/30 border-accent/50 shadow-sm">
          <Info className="h-5 w-5 text-accent-foreground" />
          <AlertTitle className="font-semibold text-accent-foreground text-sm">Rediseños Diarios Restantes: {remainingRedesignsToday}</AlertTitle>
          <AlertDescription className="text-accent-foreground/80 text-xs">
            {remainingRedesignsToday > 0 
              ? `Puedes rediseñar ${remainingRedesignsToday} habitación${remainingRedesignsToday === 1 ? '' : 'es'} más hoy.`
              : "¡Has alcanzado tu límite diario de rediseños!"}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto">
        <div className="md:sticky md:top-24 space-y-6 bg-card p-6 sm:p-8 rounded-xl shadow-xl">
          <RoomRedesignForm 
            onSubmit={handleRedesignSubmit} 
            isLoading={isLoadingRedesign} 
            isSubmitDisabled={!allowRedesign || isLoadingRedesign}
          />
        </div>
        <div className="space-y-8">
          <RedesignPreview
            originalImageSrc={originalImage}
            redesignedImageSrc={redesignedImage}
            isLoading={isLoadingRedesign}
          />
          {user && redesignedImage && !isLoadingRedesign && (
            <div className="text-center pt-2">
              <Button 
                onClick={handleSaveFavorite} 
                disabled={isAlreadyFavorite}
                size="lg"
                className="w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                <Heart className={`mr-2 h-5 w-5 ${isAlreadyFavorite ? 'fill-destructive text-destructive' : ''}`} />
                {isAlreadyFavorite ? 'Guardado en Favoritos' : 'Guardar en Favoritos'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
