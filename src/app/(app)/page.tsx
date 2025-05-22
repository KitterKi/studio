
'use client';

import { useState, useEffect } from 'react';
import RoomRedesignForm from '@/components/RoomRedesignForm';
import RedesignPreview from '@/components/RedesignPreview';
import { redesignRoom } from '@/ai/flows/redesign-room'; 
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
        console.log('[RoomStylePage] useEffect check canUserRedesign:', can, 'Remaining:', remainingRedesignsToday);
        setAllowRedesign(can);
    } else {
      console.log('[RoomStylePage] useEffect user is null, setting allowRedesign to false');
      setAllowRedesign(false); // If no user, cannot redesign
    }
  }, [user, canUserRedesign, remainingRedesignsToday]);

  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    console.log('[RoomStylePage] handleRedesignSubmit called');
    console.log('[RoomStylePage] User:', user ? user.email : 'No user');
    

    if (!user) {
      toast({ variant: "destructive", title: "Inicio de Sesión Requerido", description: "Por favor, inicia sesión para rediseñar habitaciones." });
      console.log('[RoomStylePage] Blocked: User not logged in.');
      return;
    }
    
    const canActuallyRedesign = canUserRedesign();
    console.log('[RoomStylePage] Allow Redesign Check (canUserRedesign()):', canActuallyRedesign);
    setAllowRedesign(canActuallyRedesign); 

    if (!canActuallyRedesign) {
      toast({
        variant: "destructive",
        title: "Límite Diario Alcanzado",
        description: "Has usado todos tus rediseños por hoy. Por favor, inténtalo de nuevo mañana.",
      });
      console.log('[RoomStylePage] Blocked: Daily limit reached.');
      return;
    }

    setIsLoadingRedesign(true);
    setOriginalImage(photoDataUri);
    setRedesignedImage(null);
    setCurrentStyle(style);
    
    try {
      console.log('[RoomStylePage] Calling ACTUAL redesignRoom AI flow...');
      const result = await redesignRoom({ photoDataUri, style }); 
      
      if (result.redesignedPhotoDataUri) {
        console.log('[RoomStylePage] ACTUAL redesignRoom AI flow SUCCESS. Image URL:', result.redesignedPhotoDataUri);
        setRedesignedImage(result.redesignedPhotoDataUri);
        recordRedesignAttempt();
        const updatedRemaining = remainingRedesignsToday -1; 
        toast({
          title: "¡Rediseño Completo!",
          description: `Tu habitación ha sido rediseñada en estilo ${style}. Quedan ${updatedRemaining < 0 ? 0 : updatedRemaining} rediseños hoy.`,
        });
      } else {
        console.error('[RoomStylePage] AI did not return an image. Result:', result);
        toast({
          variant: "destructive",
          title: "Falló el Rediseño",
          description: "La IA no devolvió una imagen. Esto puede ocurrir si el contenido fue bloqueado por filtros de seguridad o si hubo un error inesperado.",
        });
        setRedesignedImage(null); 
      }
    } catch (error) {
      console.error("[RoomStylePage] Error during redesignRoom call or subsequent logic:", error);
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
      setRedesignedImage(null); 
    } finally {
      setIsLoadingRedesign(false);
    }
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      addFavorite({
        // originalImage: originalImage, // No longer saving original image to localStorage to save space
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
    <div className="space-y-4 py-4 sm:space-y-6 sm:py-6">
      <div className="text-center space-y-1 px-4 sm:space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2 
                       sm:text-2xl lg:text-4xl">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
          {APP_NAME}
        </h1>
        <p className="text-xs text-muted-foreground max-w-md mx-auto 
                       sm:text-sm sm:max-w-lg">
          Transforma tu espacio al instante. Sube una foto, elige tu estilo y observa la magia de la IA.
        </p>
      </div>

      {user && (
        <Alert className="max-w-[280px] mx-auto bg-primary/10 border-primary/20 shadow-sm text-xs 
                        sm:max-w-xs sm:text-sm">
          <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary text-xs sm:text-sm">Rediseños Diarios Restantes: {remainingRedesignsToday}</AlertTitle>
          <AlertDescription className="text-primary/80 text-[10px] sm:text-xs">
            {remainingRedesignsToday > 0
              ? `Puedes rediseñar ${remainingRedesignsToday} habitación${remainingRedesignsToday === 1 ? '' : 'es'} más hoy.`
              : "¡Has alcanzado tu límite diario de rediseños!"}
          </AlertDescription>
        </Alert>
      )}
      {!user && (
         <Alert variant="destructive" className="max-w-md mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-semibold text-destructive-foreground">Inicio de Sesión Requerido</AlertTitle>
          <AlertDescription className="text-destructive-foreground/90">
            Por favor, <a href="/auth/signin" className="font-bold underline hover:text-destructive-foreground">inicia sesión</a> para generar rediseños.
          </AlertDescription>
        </Alert>
      )}


      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start max-w-7xl mx-auto px-2 sm:px-4">
        <div className="md:col-span-2 md:sticky md:top-24 bg-card/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-xl border border-border/50">
          <RoomRedesignForm
            onSubmit={handleRedesignSubmit}
            isLoading={isLoadingRedesign}
            isSubmitDisabled={!allowRedesign || isLoadingRedesign || !user} 
          />
        </div>
        <div className="md:col-span-3 space-y-4 sm:space-y-6">
          <RedesignPreview
            originalImageSrc={originalImage}
            redesignedImageSrc={redesignedImage}
            isLoading={isLoadingRedesign}
          />
          {user && redesignedImage && !isLoadingRedesign && (
            <div className="text-center pt-1 sm:pt-2">
              <Button
                onClick={handleSaveFavorite}
                disabled={isAlreadyFavorite}
                size="lg"
                className="w-full max-w-[280px] mx-auto shadow-lg hover:shadow-xl transition-shadow bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base py-2 sm:py-2.5"
              >
                <Heart className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${isAlreadyFavorite ? 'fill-destructive text-destructive' : ''}`} />
                {isAlreadyFavorite ? 'Guardado en Favoritos' : 'Guardar en Favoritos'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
    
