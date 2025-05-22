
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Added import
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
        console.log("[StyleMyRoomPage] User detected, checking canUserRedesign");
        const can = canUserRedesign();
        console.log("[StyleMyRoomPage] canUserRedesign result:", can);
        setAllowRedesign(can);
    } else {
      console.log("[StyleMyRoomPage] No user detected, setting allowRedesign to false");
      setAllowRedesign(false); 
    }
  }, [user, canUserRedesign, remainingRedesignsToday]);

  const handleRedesignSubmit = async (photoDataUri: string, style: string) => {
    console.log('[StyleMyRoomPage] handleRedesignSubmit called with style:', style, 'and photoDataUri (length):', photoDataUri?.length);
    if (!user) {
      console.log("[StyleMyRoomPage] No user, redesign submission blocked.");
      toast({ variant: "destructive", title: "Inicio de Sesión Requerido", description: "Por favor, inicia sesión para rediseñar habitaciones." });
      return;
    }
    
    const canActuallyRedesign = canUserRedesign();
    console.log("[StyleMyRoomPage] Inside handleRedesignSubmit, canActuallyRedesign:", canActuallyRedesign);
    setAllowRedesign(canActuallyRedesign); 

    if (!canActuallyRedesign) {
      console.log("[StyleMyRoomPage] Redesign attempt blocked: cannot redesign today.");
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
      console.log('[StyleMyRoomPage] Calling redesignRoom AI flow...');
      const result = await redesignRoom({ photoDataUri, style });
      
      if (result.redesignedPhotoDataUri) {
        console.log('[StyleMyRoomPage] Redesign successful, redesignedPhotoDataUri (length):', result.redesignedPhotoDataUri.length);
        setRedesignedImage(result.redesignedPhotoDataUri);
        recordRedesignAttempt();
        const updatedRemaining = remainingRedesignsToday -1; 
        toast({
          title: "¡Rediseño Completo!",
          description: `Tu habitación ha sido rediseñada en estilo ${style}. Quedan ${updatedRemaining < 0 ? 0 : updatedRemaining} rediseños hoy.`,
        });
      } else {
        console.error("[StyleMyRoomPage] Redesign failed: AI did not return an image.");
        toast({
          variant: "destructive",
          title: "Falló el Rediseño",
          description: "La IA no devolvió una imagen. El rediseño pudo haber sido bloqueado por filtros de seguridad o falló por otra razón.",
        });
        setRedesignedImage(null); 
      }
    } catch (error: any) {
      console.error("[StyleMyRoomPage] Error during redesignRoom AI call:", error);
      let description = "Ocurrió un error al rediseñar la habitación.";
      if (error.message && (error.message.includes("503") || error.message.toLowerCase().includes("overloaded"))) {
        description = "El servicio de IA está experimentando alta demanda. Por favor, inténtalo de nuevo en unos minutos.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Falló el Rediseño",
        description: description,
      });
      setRedesignedImage(null); 
    } finally {
      console.log('[StyleMyRoomPage] Redesign process finished, setting isLoadingRedesign to false.');
      setIsLoadingRedesign(false);
    }
  };

  const handleSaveFavorite = () => {
    if (originalImage && redesignedImage && currentStyle && user) {
      addFavorite({
        redesignedImage, 
        style: currentStyle,
        // originalImage: originalImage, // No longer saving original image to save space
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
          <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <AlertTitle className="font-semibold text-primary text-[11px] sm:text-sm">Rediseños Diarios: {remainingRedesignsToday}</AlertTitle>
          <AlertDescription className="text-primary/80 text-[10px] sm:text-xs">
            {remainingRedesignsToday > 0
              ? `Puedes rediseñar ${remainingRedesignsToday} más hoy.`
              : "¡Límite diario alcanzado!"}
          </AlertDescription>
        </Alert>
      )}
      {!user && (
         <Alert variant="destructive" className="max-w-md mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-semibold text-destructive-foreground">Inicio de Sesión Requerido</AlertTitle>
          <AlertDescription className="text-destructive-foreground/90">
            Por favor, <Link href="/auth/signin" className="font-bold underline hover:text-destructive-foreground">inicia sesión</Link> para generar rediseños.
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
                size="default"
                className="w-full max-w-[280px] mx-auto shadow-lg hover:shadow-xl transition-shadow bg-accent text-accent-foreground hover:bg-accent/90 text-xs py-2 sm:text-sm sm:py-2.5"
              >
                <Heart className={`mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 ${isAlreadyFavorite ? 'fill-destructive text-destructive' : ''}`} />
                {isAlreadyFavorite ? 'Guardado en Favoritos' : 'Guardar en Favoritos'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
    
