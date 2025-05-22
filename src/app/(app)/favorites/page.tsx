
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

export default function FavoritesPage() {
  const { favorites, removeFavorite, user, isLoading: authLoading, toggleUserLike } = useAuth();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);
  const [isLoadingSimilarItems, setIsLoadingSimilarItems] = useState(false);
  const [similarItems, setSimilarItems] = useState<IdentifiedItem[]>([]);

  if (authLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Cargando favoritos..." size={16} /></div>;
  }

  if (!user) {
    return (
       <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            Necesitas iniciar sesión para ver tus favoritos.
            <Link href="/auth/signin" className="text-primary hover:underline ml-1">Iniciar Sesión</Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleShareFavorite = (imageUrl: string, title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`¡Mira este rediseño de habitación: ${title}! Imagen: ${imageUrl}`)
        .then(() => {
          toast({ title: "¡Enlace Copiado!", description: "Información del rediseño copiada al portapapeles." });
        })
        .catch(err => {
          console.error('Falló al copiar: ', err);
          toast({ variant: "destructive", title: "Falló al Copiar", description: "No se pudo copiar al portapapeles." });
        });
    } else {
      toast({ variant: "destructive", title: "Error de Portapapeles", description: "Acceso al portapapeles no disponible." });
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
          title: "No se Encontraron Artículos Distintos",
          description: "La IA no pudo identificar artículos distintos para buscar en esta imagen.",
        });
      }
    } catch (error) {
      console.error("Error encontrando artículos similares:", error);
      let errorMessage = "Falló la búsqueda de artículos similares. Por favor, inténtalo de nuevo.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Error de IA",
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
            <Heart className="h-10 w-10 text-primary" /> Mis Rediseños Favoritos
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
            Tu colección personal de transformaciones de habitaciones inspiradoras. ¡Haz clic en una imagen para encontrar artículos similares!
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="relative group">
                <DesignCard
                  id={fav.id}
                  imageUrl={fav.redesignedImage} 
                  title={fav.title || `Rediseño en ${fav.style}`}
                  userName={user.name || user.email || "Tú"}
                  likes={fav.likes} 
                  comments={fav.comments}
                  isLikedByCurrentUser={fav.userHasLiked}
                  onLikeClick={() => toggleUserLike(fav.id)}
                  dataAiHint="habitación rediseñada"
                  onImageClick={() => handleOpenFindItemsModal(fav)}
                  isImageClickable={true}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => handleShareFavorite(fav.redesignedImage, fav.title || `Rediseño en ${fav.style}`)}
                    aria-label="Compartir diseño"
                    className="bg-primary/80 hover:bg-primary text-primary-foreground"
                    title="Compartir diseño"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFavorite(fav.id)}
                    aria-label="Eliminar de favoritos"
                    title="Eliminar de favoritos"
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
            <p className="text-2xl font-semibold text-muted-foreground mb-2">¡Aún no tienes favoritos!</p>
            <p className="text-muted-foreground mb-6">Comienza a rediseñar y guarda tus mejores creaciones.</p>
            <Link href="/" passHref legacyBehavior>
              <Button size="lg">
                Rediseñar una Habitación
              </Button>
            </Link>
          </div>
        )}
      </div>

      {selectedFavorite && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-xl">Encontrar Artículos para "{selectedFavorite.title}"</DialogTitle>
              <DialogDescription>
                Artículos identificados por la IA. Haz clic para buscar en Google Shopping (abrirá en nueva pestaña).
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-0 flex-grow min-h-0">
              <div className="relative aspect-square w-full md:aspect-auto md:h-full p-4 md:border-r flex items-center justify-center bg-muted/30">
                <Image
                  src={selectedFavorite.redesignedImage}
                  alt={`Habitación rediseñada: ${selectedFavorite.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain rounded-md"
                />
              </div>

              <div className="flex flex-col min-h-0 p-4">
                {isLoadingSimilarItems && (
                  <div className="flex flex-col items-center justify-center h-full py-10 flex-grow">
                    <LoadingSpinner text="La IA está identificando artículos..." size={10}/>
                  </div>
                )}
                {!isLoadingSimilarItems && similarItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-10 flex-grow">
                    <Alert className="max-w-sm">
                      <Info className="h-4 w-4" />
                      <AlertTitle>No se Encontró Nada</AlertTitle>
                      <AlertDescription>
                        La IA no pudo identificar artículos distintos. Prueba con otra imagen.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                {!isLoadingSimilarItems && similarItems.length > 0 && (
                  <div className="space-y-3 overflow-y-auto flex-grow pr-1"> 
                    {similarItems.map((item, index) => (
                      <a
                        key={index}
                        href={`https://www.google.com/search?tbm=shop&gl=CL&hl=es&q=${encodeURIComponent(item.suggestedSearchQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Buscar "${item.itemName}" en Google Shopping`}
                        className="flex items-center justify-between p-3 bg-card/60 hover:bg-card rounded-lg transition-colors duration-150 shadow-sm border cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Search className="h-5 w-5 text-primary shrink-0" />
                          <span className="font-medium text-card-foreground truncate" title={item.itemName}>{item.itemName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary group-hover:text-primary/80 text-sm shrink-0 ml-2">
                          Buscar <ExternalLink className="h-3.5 w-3.5" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="p-4 border-t mt-auto bg-background">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
    
