
'use client';

import { useState, useEffect } from 'react';
import RoomRedesignForm from '@/components/RoomRedesignForm';
import RedesignPreview from '@/components/RedesignPreview';
// import { redesignRoom } from '@/ai/flows/redesign-room'; // AI CALL RE-ENABLED
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, Info, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { APP_NAME } from '@/lib/constants';

// MOCK AI CALL (Comment out if using actual AI)
const mockRedesignRoom = async (photoDataUri: string, style: string): Promise<{ redesignedPhotoDataUri: string | null }> => {
  console.log('[StyleMyRoomPage] Simulating AI redesign call for MOCK...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simulate potential AI failure
  // if (Math.random() < 0.1) { // 10% chance of failure
  //   console.log('[StyleMyRoomPage] Mock AI call simulated failure.');
  //   return { redesignedPhotoDataUri: null };
  // }
  const mockRedesignedImageUrl = `https://placehold.co/800x600.png?text=Rediseño+${encodeURIComponent(style)}`;
  console.log('[StyleMyRoomPage] Mock AI call simulated SUCCESS.');
  return { redesignedPhotoDataUri: mockRedesignedImageUrl };
};
// END MOCK AI CALL

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
        const can = canUserRedesign();
        setAllowRedesign(can);
    } else {
      setAllowRedesign(false);
    }
  }, [user, canUserRedesign, remainingRedesignsToday]);

  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    console.log('[StyleMyRoomPage] handleRedesignSubmit called');
    console.log('[StyleMyRoomPage] User:', user ? user.email : 'No user');
    

    if (!user) {
      toast({ variant: "destructive", title: "No Has Iniciado Sesión", description: "Por favor, inicia sesión para rediseñar habitaciones." });
      console.log('[StyleMyRoomPage] Blocked: User not logged in.');
      return;
    }
    
    const canActuallyRedesign = canUserRedesign();
    console.log('[StyleMyRoomPage] Allow Redesign Check (canUserRedesign()):', canActuallyRedesign);
    setAllowRedesign(canActuallyRedesign); 

    if (!canActuallyRedesign) {
      toast({
        variant: "destructive",
        title: "Límite Diario Alcanzado",
        description: "Has usado todos tus rediseños por hoy. Por favor, inténtalo de nuevo mañana.",
      });
      console.log('[StyleMyRoomPage] Blocked: Daily limit reached.');
      return;
    }

    setIsLoadingRedesign(true);
    setOriginalImage(photoDataUri);
    setRedesignedImage(null);
    setCurrentStyle(style);

    // MOCK AI CALL (Comment this block and uncomment the actual AI call block below if reactivating AI)
    try {
      const result = await mockRedesignRoom(photoDataUri, style);
      if (result.redesignedPhotoDataUri) {
        setRedesignedImage(result.redesignedPhotoDataUri);
        recordRedesignAttempt();
        const canStillRedesignAfterAttempt = canUserRedesign();
        setAllowRedesign(canStillRedesignAfterAttempt);
        toast({
          title: "¡Rediseño Simulado Completo!",
          description: `Tu habitación ha sido rediseñada (simulación) en estilo ${style}. Quedan ${remainingRedesignsToday < 0 ? 0 : remainingRedesignsToday} rediseños hoy.`,
        });
      } else {
         console.error('[StyleMyRoomPage] Mock AI did not return an image.');
        toast({
          variant: "destructive",
          title: "Falló el Rediseño (Simulado)",
          description: "La IA (simulada) no devolvió una imagen. Inténtalo de nuevo.",
        });
        setRedesignedImage(null);
      }
    } catch (error) {
      console.error("[StyleMyRoomPage] Error during MOCK redesignRoom call:", error);
       toast({
        variant: "destructive",
        title: "Falló el Rediseño (Simulado)",
        description: "Ocurrió un error al simular el rediseño.",
      });
      setRedesignedImage(null);
    } finally {
      setIsLoadingRedesign(false);
    }
    // END MOCK AI CALL


    // ACTUAL AI CALL (Uncomment this block and comment out the MOCK AI CALL block above if reactivating AI)
    /*
    try {
      console.log('[StyleMyRoomPage] Calling ACTUAL redesignRoom AI flow...');
      const result = await redesignRoom({ photoDataUri, style });
      
      if (result.redesignedPhotoDataUri) {
        console.log('[StyleMyRoomPage] ACTUAL redesignRoom AI flow SUCCESS. Image URI starts with:', result.redesignedPhotoDataUri.substring(0, 50));
        setRedesignedImage(result.redesignedPhotoDataUri);
        recordRedesignAttempt();
        const canStillRedesignAfterAttempt = canUserRedesign(); // Re-check after recording
        setAllowRedesign(canStillRedesignAfterAttempt);
        toast({
          title: "¡Rediseño Completo!",
          description: `Tu habitación ha sido rediseñada en estilo ${style}. Quedan ${remainingRedesignsToday < 0 ? 0 : remainingRedesignsToday} rediseños hoy.`,
        });
      } else {
        console.error('[StyleMyRoomPage] AI did not return an image. Result:', result);
        toast({
          variant: "destructive",
          title: "Falló el Rediseño",
          description: "La IA no devolvió una imagen. Esto puede ocurrir si el contenido fue bloqueado por filtros de seguridad o si hubo un error inesperado.",
        });
        setRedesignedImage(null); // Ensure preview is cleared
      }
    } catch (error) {
      console.error("[StyleMyRoomPage] Error during redesignRoom call or subsequent logic:", error);
      let errorTitle = "Falló el Rediseño";
      let errorMessage = "Ocurrió un error al rediseñar la habitación. Por favor, inténtalo de nuevo.";
      if (error instanceof Error) {
        if (error.message.includes("503") || error.message.toLowerCase().includes("overloaded") || error.message.toLowerCase().includes("service unavailable")) {
          errorTitle = "Servicio de IA Ocupado";
          errorMessage = "El servicio de IA está experimentando alta demanda. Por favor, inténtalo de nuevo en unos minutos.";
        } else if (error.message.toLowerCase().includes("safety filter") || error.message.toLowerCase().includes("blocked")) {
          errorTitle = "Contenido Bloqueado";
          errorMessage = "El rediseño no se pudo generar porque el contenido fue bloqueado por filtros de seguridad de la IA.";
        } else {
          errorMessage = error.message;
        }
      }
      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
      setRedesignedImage(null); // Ensure preview is cleared
    } finally {
      setIsLoadingRedesign(false);
    }
    */
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      addFavorite({
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
    <div className="space-y-6 py-6 sm:py-8">
      <div className="text-center space-y-2 sm:space-y-3 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          {APP_NAME}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg sm:max-w-xl mx-auto">
          Transforma tu espacio al instante. Sube una foto, elige tu estilo preferido y observa cómo la IA reimagina tu habitación.
        </p>
      </div>

      {user && (
        <Alert className="max-w-sm sm:max-w-md mx-auto bg-primary/10 border-primary/20 shadow-sm">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary text-sm">Rediseños Diarios Restantes: {remainingRedesignsToday}</AlertTitle>
          <AlertDescription className="text-primary/80 text-xs">
            {remainingRedesignsToday > 0
              ? `Puedes rediseñar ${remainingRedesignsToday} habitación${remainingRedesignsToday === 1 ? '' : 'es'} más hoy.`
              : "¡Has alcanzado tu límite diario de rediseños!"}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start max-w-7xl mx-auto px-4">
        <div className="md:col-span-2 md:sticky md:top-24 bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-border/50">
          <RoomRedesignForm
            onSubmit={handleRedesignSubmit}
            isLoading={isLoadingRedesign}
            isSubmitDisabled={!allowRedesign || isLoadingRedesign || !user} 
          />
        </div>
        <div className="md:col-span-3 space-y-6 sm:space-y-8">
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
                className="w-full max-w-xs mx-auto shadow-lg hover:shadow-xl transition-shadow bg-accent text-accent-foreground hover:bg-accent/90"
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
