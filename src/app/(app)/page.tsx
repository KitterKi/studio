
'use client';

import { useState, useEffect } from 'react';
import RoomRedesignForm from '@/components/RoomRedesignForm';
import RedesignPreview from '@/components/RedesignPreview';
// import { redesignRoom } from '@/ai/flows/redesign-room'; // AI call commented out
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
    // console.log('[StyleMyRoomPage] useEffect for allowRedesign triggered.');
    if(user){
        const can = canUserRedesign();
        // console.log('[StyleMyRoomPage] User exists. canUserRedesign():', can, 'Remaining today:', remainingRedesignsToday);
        setAllowRedesign(can);
    } else {
      // console.log('[StyleMyRoomPage] No user. Setting allowRedesign to false.');
      setAllowRedesign(false);
    }
  }, [user, canUserRedesign, remainingRedesignsToday]);


  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    // console.log('[StyleMyRoomPage] handleRedesignSubmit triggered with photo and style.');
    // console.log('[StyleMyRoomPage] Current user:', !!user, 'Current allowRedesign (state):', allowRedesign);

    if (!user) {
      // console.log('[StyleMyRoomPage] No user authenticated. Toasting and returning.');
      toast({ variant: "destructive", title: "No Has Iniciado Sesión", description: "Por favor, inicia sesión para rediseñar habitaciones." });
      return;
    }

    if (!canUserRedesign()) {
      // console.log('[StyleMyRoomPage] Redesign not allowed by canUserRedesign() from context. Toasting and returning.');
      toast({
        variant: "destructive",
        title: "Límite Diario Alcanzado",
        description: "Has usado todos tus rediseños por hoy. Por favor, inténtalo de nuevo mañana.",
      });
      return;
    }

    // console.log('[StyleMyRoomPage] Proceeding with redesign. Setting loading states...');
    setIsLoadingRedesign(true);
    setOriginalImage(photoDataUri);
    setRedesignedImage(null);
    setCurrentStyle(style);

    try {
      // console.log('[StyleMyRoomPage] Calling MOCK redesignRoom AI flow...');
      // Simulate AI call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const mockRedesignedPhotoDataUri = `https://placehold.co/800x600.png?text=Rediseño+Simulado+Estilo+${style.replace(/\s+/g, '+')}`;
      // const result = await redesignRoom({ photoDataUri, style }); // Actual AI call commented out

      // console.log('[StyleMyRoomPage] MOCK redesignRoom AI flow result:', mockRedesignedPhotoDataUri);

      if (mockRedesignedPhotoDataUri) {
        // console.log('[StyleMyRoomPage] Redesign successful. Updating UI and recording attempt.');
        setRedesignedImage(mockRedesignedPhotoDataUri);
        recordRedesignAttempt(); // Still record attempt for daily limit
        const canStillRedesign = canUserRedesign();
        // console.log('[StyleMyRoomPage] After recording attempt, canUserRedesign():', canStillRedesign);
        setAllowRedesign(canStillRedesign);
        toast({
          title: "¡Rediseño Simulado Completo!",
          description: `Tu habitación ha sido rediseñada (simulación) en estilo ${style}.`,
        });
      } else {
        // console.error('[StyleMyRoomPage] AI did not return an image.'); // Should not happen with mock
        toast({
          variant: "destructive",
          title: "Falló el Rediseño Simulado",
          description: "La simulación de IA no devolvió una imagen.",
        });
        setRedesignedImage(null); 
      }
    } catch (error) {
      // console.error("[StyleMyRoomPage] Error during MOCK redesignRoom call or subsequent logic:", error);
      let errorMessage = "Falló el rediseño simulado de la habitación. Por favor, inténtalo de nuevo.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
       // This toast might show the technical error message if the API call itself fails.
       // If the API call works but no image is returned (which is a specific case caught above), a different toast is shown.
      toast({
        variant: "destructive",
        title: "Falló el Rediseño Simulado",
        description: errorMessage,
      });
      setRedesignedImage(null);
    } finally {
      // console.log('[StyleMyRoomPage] In finally block, setting isLoadingRedesign to false.');
      setIsLoadingRedesign(false);
    }
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      addFavorite({
        // originalImage, // No longer storing full originalImage DataURI
        redesignedImage,
        style: currentStyle,
      });
      toast({
        title: "¡Añadido a Favoritos!",
        description: `Rediseño estilo ${currentStyle} ha sido guardado.`,
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-foreground">
          Diseñador IA {APP_NAME}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base lg:text-lg max-w-2xl mx-auto">
          Transforma tu espacio: sube una foto, elige un estilo ¡y deja que la IA (simulada) haga su magia!
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
        <div className="md:sticky md:top-24 bg-card p-6 sm:p-8 rounded-xl shadow-xl">
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
