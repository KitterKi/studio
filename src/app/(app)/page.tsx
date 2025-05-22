
'use client';

import { useState, useEffect } from 'react';
import RoomRedesignForm from '@/components/RoomRedesignForm';
import RedesignPreview from '@/components/RedesignPreview';
// import { redesignRoom } from '@/ai/flows/redesign-room'; // Re-enable if using actual AI
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, Info, Sparkles } from 'lucide-react';
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
        const can = canUserRedesign();
        setAllowRedesign(can);
    } else {
      setAllowRedesign(false);
    }
  }, [user, canUserRedesign, remainingRedesignsToday]);

  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    console.log('[StyleMyRoomPage] handleRedesignSubmit called');
    console.log('[StyleMyRoomPage] User:', user ? user.email : 'No user');
    console.log('[StyleMyRoomPage] Allow Redesign Check:', canUserRedesign());

    if (!user) {
      toast({ variant: "destructive", title: "No Has Iniciado Sesión", description: "Por favor, inicia sesión para rediseñar habitaciones." });
      return;
    }

    if (!canUserRedesign()) {
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

    // SIMULATED AI CALL
    console.log('[StyleMyRoomPage] Simulating AI redesign call...');
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate AI processing time

    const mockRedesignedImageUrl = `https://placehold.co/800x600.png?text=Rediseño+${encodeURIComponent(style)}`;
    setRedesignedImage(mockRedesignedImageUrl);
    recordRedesignAttempt();
    const canStillRedesign = canUserRedesign();
    setAllowRedesign(canStillRedesign);
    toast({
      title: "¡Rediseño Simulado Completo!",
      description: `Tu habitación ha sido rediseñada (simulación) en estilo ${style}.`,
    });
    setIsLoadingRedesign(false);

    // ACTUAL AI CALL (Keep commented out for Spark plan)
    /*
    try {
      console.log('[StyleMyRoomPage] Calling ACTUAL redesignRoom AI flow...');
      const result = await redesignRoom({ photoDataUri, style });
      console.log('[StyleMyRoomPage] ACTUAL redesignRoom AI flow result:', result.redesignedPhotoDataUri);

      if (result.redesignedPhotoDataUri) {
        setRedesignedImage(result.redesignedPhotoDataUri);
        recordRedesignAttempt();
        const canStillRedesign = canUserRedesign();
        setAllowRedesign(canStillRedesign);
        toast({
          title: "¡Rediseño Completo!",
          description: `Tu habitación ha sido rediseñada en estilo ${style}.`,
        });
      } else {
        console.error('[StyleMyRoomPage] AI did not return an image.');
        toast({
          variant: "destructive",
          title: "Falló el Rediseño",
          description: "La IA no devolvió una imagen. Esto puede ocurrir si el contenido fue bloqueado por filtros de seguridad o si hubo un error inesperado.",
        });
        setRedesignedImage(null);
      }
    } catch (error) {
      console.error("[StyleMyRoomPage] Error during redesignRoom call or subsequent logic:", error);
      let errorTitle = "Falló el Rediseño";
      let errorMessage = "Ocurrió un error al rediseñar la habitación. Por favor, inténtalo de nuevo.";
      if (error instanceof Error) {
        if (error.message.includes("503") || error.message.toLowerCase().includes("overloaded") || error.message.toLowerCase().includes("service unavailable")) {
          errorTitle = "Servicio de IA Ocupado";
          errorMessage = "El servicio de IA está experimentando alta demanda. Por favor, inténtalo de nuevo en unos minutos.";
        } else if (error.message.toLowerCase().includes("safety filter") || error.message.toLowerCase().includes("blocked by safety filters")) {
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
      setRedesignedImage(null);
    } finally {
      setIsLoadingRedesign(false);
    }
    */
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      addFavorite({
        redesignedImage, // originalImage is not crucial for favorites, so we pass redesignedImage
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
    <div className="space-y-10 py-8">
      <div className="text-center space-y-3 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          {APP_NAME}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Transforma tu espacio al instante. Sube una foto, elige tu estilo preferido y observa cómo la IA (actualmente simulada) reimagina tu habitación.
        </p>
      </div>

      {user && (
        <Alert className="max-w-md mx-auto bg-primary/10 border-primary/20 shadow-sm text-primary-foreground">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary text-sm">Rediseños Diarios Restantes: {remainingRedesignsToday}</AlertTitle>
          <AlertDescription className="text-primary/80 text-xs">
            {remainingRedesignsToday > 0
              ? `Puedes rediseñar ${remainingRedesignsToday} habitación${remainingRedesignsToday === 1 ? '' : 'es'} más hoy.`
              : "¡Has alcanzado tu límite diario de rediseños!"}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-start max-w-7xl mx-auto px-4">
        <div className="md:col-span-2 md:sticky md:top-24 bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-border/50">
          <RoomRedesignForm
            onSubmit={handleRedesignSubmit}
            isLoading={isLoadingRedesign}
            isSubmitDisabled={!allowRedesign || isLoadingRedesign}
          />
        </div>
        <div className="md:col-span-3 space-y-8">
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
