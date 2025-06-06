
'use client';

import { useState } from 'react';
import type { FavoriteItem } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import DesignCard from '@/components/DesignCard';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Share2, ExternalLink, Info, Search, Wand2, X, Edit3, Check } from 'lucide-react';
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
  DialogClose,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_NAME } from '@/lib/constants';
import { findSimilarItems, type IdentifiedItem } from '@/ai/flows/find-similar-items-flow';


export default function FavoritesPage() {
  const { favorites, removeFavorite, user, isLoading: authLoading, toggleUserLike, updateFavoriteTitle } = useAuth();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);
  const [isLoadingSimilarItems, setIsLoadingSimilarItems] = useState(false);
  const [similarItems, setSimilarItems] = useState<IdentifiedItem[]>([]);

  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(null);
  const [currentEditTitle, setCurrentEditTitle] = useState<string>('');


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
    if (editingFavoriteId) return; 

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`¡Mira este rediseño de habitación de ${APP_NAME}: ${title}! Imagen: ${imageUrl}`)
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
    if (editingFavoriteId) return; 

    setSelectedFavorite(favorite);
    setIsModalOpen(true);
    setIsLoadingSimilarItems(true);
    setSimilarItems([]);

    try {
      console.log('[FavoritesPage] Calling findSimilarItems with image:', favorite.redesignedImage.substring(0, 50) + "...");
      const result = await findSimilarItems({ imageDataUri: favorite.redesignedImage });
      console.log('[FavoritesPage] findSimilarItems result:', result);

      setSimilarItems(result.items);
      if (result.items.length === 0) {
        toast({
          title: "No se Encontraron Artículos",
          description: "La IA no identificó artículos distintos en esta imagen o no pudo generar sugerencias de búsqueda.",
        });
      }
    } catch (error: any) {
      console.error("[FavoritesPage] Error buscando artículos similares:", error);
      let errorMessage = "Falló la búsqueda de artículos similares. Por favor, inténtalo de nuevo.";
      if (error && error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Error al Buscar Artículos",
        description: errorMessage,
      });

       if (typeof error === 'object' && error !== null && 'message' in error) {
        if (String((error as Error).message).includes("503") || String((error as Error).message).toLowerCase().includes("overloaded")) {
           toast({
            variant: "destructive",
            title: "Servicio de IA Ocupado",
            description: "El servicio de IA está experimentando alta demanda. Por favor, inténtalo de nuevo en unos minutos.",
          });
        }
      }
    } finally {
      setIsLoadingSimilarItems(false);
    }
  };
  
  const handleStartEdit = (favorite: FavoriteItem) => {
    console.log("[FavoritesPage] handleStartEdit called for favorite:", favorite.id);
    setEditingFavoriteId(favorite.id);
    setCurrentEditTitle(favorite.title);
     toast({ title: "Editando Nombre...", description: "Escribe el nuevo nombre y presiona Enter o haz clic en Guardar.", duration: 2000 });
  };

  const handleSaveEdit = () => {
    if (editingFavoriteId && currentEditTitle.trim() !== "") {
      console.log("[FavoritesPage] handleSaveEdit: Saving title for", editingFavoriteId, "New title:", currentEditTitle.trim());
      updateFavoriteTitle(editingFavoriteId, currentEditTitle.trim());
      toast({ title: "Nombre Actualizado", description: `El rediseño ahora se llama "${currentEditTitle.trim()}".` });
    } else if (editingFavoriteId) { 
      console.log("[FavoritesPage] handleSaveEdit: Invalid title for", editingFavoriteId, "Title was:", currentEditTitle);
      toast({ variant: "destructive", title: "Nombre Inválido", description: "El nombre no puede estar vacío. La edición fue cancelada."});
    }
    setEditingFavoriteId(null);
    setCurrentEditTitle('');
  };

  const handleCancelEdit = () => {
    console.log("[FavoritesPage] handleCancelEdit: Cancelling edit for", editingFavoriteId);
    toast({title: "Edición Cancelada", description: "No se realizaron cambios en el nombre. Es posible que tu navegador esté bloqueando el cuadro de diálogo.", variant: "default"});
    setEditingFavoriteId(null);
    setCurrentEditTitle('');
  };


  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center justify-center gap-2 sm:gap-3">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" /> Mis Rediseños Favoritos
          </h1>
          <p className="mt-2 text-sm sm:text-base xl:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tu colección personal de transformaciones inspiradoras. Haz clic en una imagen para encontrar artículos similares.
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 sm:px-4">
            {favorites.map((fav) => (
              <div key={fav.id} className="relative group">
                <DesignCard
                  id={fav.id}
                  imageUrl={fav.redesignedImage}
                  title={fav.title || `Rediseño en ${fav.style}`}
                  userName={user.name || user.email || "Tú"}
                  // userAvatarUrl - not needed for mock auth or use placeholder based on name/email
                  likes={fav.likes}
                  comments={fav.comments}
                  isLikedByCurrentUser={fav.userHasLiked}
                  onLikeClick={() => !editingFavoriteId && toggleUserLike(fav.id)}
                  dataAiHint="habitación rediseñada"
                  onImageClick={() => editingFavoriteId !== fav.id && handleOpenFindItemsModal(fav)}
                  isImageClickable={editingFavoriteId !== fav.id}
                  
                  isEditing={editingFavoriteId === fav.id}
                  editTitleValue={editingFavoriteId === fav.id ? currentEditTitle : fav.title}
                  onEditTitleChange={setCurrentEditTitle}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-1.5 sm:gap-2">
                  {editingFavoriteId === fav.id ? (
                    <>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={handleSaveEdit}
                        aria-label="Guardar nombre"
                        className="bg-green-500/90 hover:bg-green-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8"
                        title="Guardar nombre"
                      >
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleCancelEdit}
                        aria-label="Cancelar edición"
                        className="bg-red-500/90 hover:bg-red-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8"
                        title="Cancelar edición"
                      >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleStartEdit(fav)}
                        aria-label="Editar nombre"
                        className="bg-background/80 hover:bg-accent text-foreground rounded-full w-7 h-7 sm:w-8 sm:h-8"
                        title="Editar nombre"
                      >
                        <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                       <Button
                        variant="default"
                        size="icon"
                        onClick={() => handleShareFavorite(fav.redesignedImage, fav.title || `Rediseño en ${fav.style}`)}
                        aria-label="Compartir diseño"
                        className="bg-primary/80 hover:bg-primary text-primary-foreground rounded-full w-7 h-7 sm:w-8 sm:h-8"
                        title="Compartir diseño"
                      >
                        <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFavorite(fav.id)}
                        aria-label="Eliminar de favoritos"
                        className="rounded-full w-7 h-7 sm:w-8 sm:h-8"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 border-2 border-dashed border-muted rounded-lg mx-2 sm:mx-4">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <p className="text-xl sm:text-2xl font-semibold text-muted-foreground mb-1 sm:mb-2">¡Aún no tienes favoritos!</p>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Comienza a rediseñar y guarda tus mejores creaciones.</p>
            <Link href="/" passHref legacyBehavior>
              <Button size="lg">
                <Wand2 className="mr-2 h-4 w-4" />
                Rediseñar una Habitación
              </Button>
            </Link>
          </div>
        )}
      </div>

      {selectedFavorite && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-4 sm:p-6 border-b">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-primary truncate">
                 Artículos: {selectedFavorite.title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                Toca un objeto para buscarlo online.
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-0 flex-grow min-h-0">
              <div className="w-full p-4 sm:p-6 md:border-r flex items-center justify-center bg-muted/20 order-first md:order-none">
                <div className="relative w-full max-w-md aspect-[4/3] bg-background rounded-lg shadow-xl overflow-hidden border">
                  <Image
                    src={selectedFavorite.redesignedImage}
                    alt={`Habitación rediseñada: ${selectedFavorite.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 448px"
                    className="object-contain"
                    data-ai-hint="redesigned room item search"
                  />
                </div>
              </div>

              <div className="flex flex-col min-h-0 order-last md:order-none">
                {isLoadingSimilarItems && (
                  <div className="flex flex-col items-center justify-center h-full py-8 sm:py-10 flex-grow p-4 sm:p-6">
                    <LoadingSpinner text="La IA está identificando artículos..." size={10}/>
                  </div>
                )}
                {!isLoadingSimilarItems && similarItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-8 sm:py-10 flex-grow p-4 sm:p-6 text-center">
                    <Alert variant="default" className="max-w-sm bg-card border-border">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                      <AlertTitle className="text-sm sm:text-base">No se Encontró Nada</AlertTitle>
                      <AlertDescription className="text-xs">
                        La IA no pudo identificar artículos distintos en esta imagen.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                {!isLoadingSimilarItems && similarItems.length > 0 && (
                  <ScrollArea className="flex-grow p-3 sm:p-4 min-h-0">
                    <div className="space-y-1.5 sm:space-y-2">
                      {similarItems.map((item, index) => (
                        <a
                          key={index}
                          href={`https://www.google.com/search?tbm=shop&gl=CL&hl=es&q=${encodeURIComponent(item.suggestedSearchQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-between p-2.5 sm:p-3 rounded-md transition-colors group",
                            "bg-card hover:bg-accent/50 border border-border hover:border-primary/50"
                          )}
                          aria-label={`Buscar "${item.itemName}" en Google Shopping`}
                        >
                          <span className="font-medium text-xs sm:text-sm text-card-foreground group-hover:text-primary truncate pr-2" title={item.itemName}>
                            {item.itemName}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                        </a>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
            <DialogFooter className="p-4 border-t mt-auto bg-background sm:justify-start">
                <DialogClose asChild>
                    <Button variant="outline">Cerrar</Button>
                </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
