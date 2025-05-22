
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle, Mail, Edit3, Heart, Image as ImageIcon, LogOut, Users, Columns, Settings, Grid3x3, MessageCircle, Wand2, Search, Share2, X, ExternalLink, Info, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import type { FavoriteItem } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
// import { findSimilarItems, type IdentifiedItem } from '@/ai/flows/find-similar-items-flow'; // AI call commented out
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

// Temporary mock type for IdentifiedItem if the import is removed
export interface IdentifiedItem {
  itemName: string;
  itemDescription?: string; // Made optional as it's not displayed and AI won't generate it
  suggestedSearchQuery: string;
}

const MOCK_SIMILAR_ITEMS_PROFILE: IdentifiedItem[] = [
  { itemName: 'Silla de Escritorio (Simulada)', suggestedSearchQuery: 'silla de escritorio ergonómica negra' },
  { itemName: 'Monitor Curvo (Simulado)', suggestedSearchQuery: 'monitor curvo 27 pulgadas gaming' },
  { itemName: 'Teclado Mecánico (Simulado)', suggestedSearchQuery: 'teclado mecánico RGB retroiluminado' },
];


export default function ProfilePage() {
  const { user, isLoading, logout, favorites, followingCount, removeFavorite, toggleUserLike } = useAuth();
  const [selectedFavoriteForDetail, setSelectedFavoriteForDetail] = useState<FavoriteItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [isFindItemsModalOpen, setIsFindItemsModalOpen] = useState(false);
  const [favoriteForSimilarItems, setFavoriteForSimilarItems] = useState<FavoriteItem | null>(null);
  const [isLoadingSimilarItems, setIsLoadingSimilarItems] = useState(false);
  const [similarItems, setSimilarItems] = useState<IdentifiedItem[]>([]);

  const handleOpenFindItemsModalFromDetail = async (favorite: FavoriteItem) => {
    setFavoriteForSimilarItems(favorite);
    setIsDetailModalOpen(false); 
    setIsFindItemsModalOpen(true); 
    setIsLoadingSimilarItems(true);
    setSimilarItems([]);

    try {
      // Simulate AI call for similar items
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      // const result = await findSimilarItems({ imageDataUri: favorite.redesignedImage }); // Actual AI call commented out
      const result = { items: MOCK_SIMILAR_ITEMS_PROFILE }; // Use mock items

      setSimilarItems(result.items);
      if (result.items.length === 0) {
        toast({
          title: "No se Encontraron Artículos (Simulación)",
          description: "La simulación de IA no pudo identificar artículos distintos para buscar en esta imagen.",
        });
      }
    } catch (error) {
      console.error("Error simulando búsqueda de artículos:", error);
      let errorTitle = "Error de Simulación";
      let errorMessage = "Falló la búsqueda simulada de artículos. Por favor, inténtalo de nuevo.";
      if (error instanceof Error) {
         if (error.message.includes("503") || error.message.toLowerCase().includes("overloaded") || error.message.toLowerCase().includes("service unavailable")) {
          errorTitle = "Servicio Simulado Ocupado";
          errorMessage = "El servicio simulado está experimentando alta demanda. Por favor, inténtalo de nuevo en unos minutos.";
        } else {
          errorMessage = error.message;
        }
      }
      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
    } finally {
      setIsLoadingSimilarItems(false);
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Cargando perfil..." size={16} /></div>;
  }

  if (!user) {
     return (
       <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            Necesitas iniciar sesión para ver tu perfil.
             <Link href="/auth/signin" className="text-primary hover:underline ml-1">Iniciar Sesión</Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    if (email) return email.substring(0,2).toUpperCase();
    return 'U';
  }

  const mockFollowers = Math.floor(Math.random() * 1000) + 50;

  const openFavoriteDetail = (fav: FavoriteItem) => {
    setSelectedFavoriteForDetail(fav);
    setIsDetailModalOpen(true);
  };

  const handleShareFavoriteFromDetail = (imageUrl: string, title: string) => {
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


  return (
    <>
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 border-b pb-8">
          <Avatar className="h-32 w-32 sm:h-40 sm:w-40 ring-4 ring-primary/30 ring-offset-background ring-offset-2 shrink-0">
            <AvatarImage
              src={`https://placehold.co/160x160.png?text=${getInitials(user.name, user.email)}`}
              alt={user.name || user.email || 'Avatar de usuario'}
              data-ai-hint="profile large"
            />
            <AvatarFallback className="text-5xl">{getInitials(user.name, user.email)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center sm:items-start space-y-3 flex-grow">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <h1 className="text-3xl font-light text-foreground truncate">{user.name || 'Usuario Anónimo'}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push('/profile/edit')}>
                  <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
                 <Button variant="ghost" size="icon" onClick={() => router.push('/settings')} title="Configuración">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-center sm:text-left">{user.email}</p>

            <div className="flex gap-4 sm:gap-6 pt-2 text-center sm:text-left">
              <div>
                <span className="font-semibold text-lg">{favorites.length}</span>
                <span className="text-muted-foreground ml-1">publicaciones</span>
              </div>
              <div>
                <span className="font-semibold text-lg">{mockFollowers.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">seguidores</span>
              </div>
              <div>
                <span className="font-semibold text-lg">{followingCount.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">siguiendo</span>
              </div>
            </div>
            <p className="text-sm text-foreground pt-1 text-center sm:text-left max-w-md">
              Bienvenido a tu espacio en {APP_NAME}. ¡Aquí puedes ver tus creaciones favoritas y compartirlas con el mundo!
            </p>
            <Button variant="outline" size="sm" onClick={logout} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-center gap-4 border-t pt-2">
              <Button variant="ghost" className="text-primary border-b-2 border-primary h-12">
                  <Grid3x3 className="mr-2 h-4 w-4"/> PUBLICACIONES
              </Button>
              <Button variant="ghost" className="text-muted-foreground h-12" disabled>
                  <Heart className="mr-2 h-4 w-4"/> GUARDADO (Próximamente)
              </Button>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4 mt-6">
              {favorites.map((fav) => (
                <button
                  key={fav.id}
                  onClick={() => openFavoriteDetail(fav)}
                  className="group relative aspect-square overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  title={`Ver detalles de "${fav.title || 'Diseño'}"`}
                  aria-label={`Ver detalles de "${fav.title || 'Diseño'}"`}
                >
                  <Image
                    src={fav.redesignedImage}
                    alt={fav.title || `Diseño ${fav.style}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="favorite design"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2">
                    <div className="text-white text-sm sm:text-base text-center flex items-center gap-2 sm:gap-4">
                      <span className="flex items-center gap-1"><Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-white"/> {fav.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 fill-white"/> {fav.comments}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 mt-6 border-2 border-dashed border-muted rounded-lg">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-muted-foreground mb-2">Aún no tienes publicaciones</p>
              <p className="text-muted-foreground mb-6">¡Empieza a rediseñar y guarda tus creaciones para verlas aquí!</p>
              <Link href="/" passHref legacyBehavior>
                <Button size="lg">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Rediseñar una Habitación
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      {selectedFavoriteForDetail && (
        <Dialog open={isDetailModalOpen} onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedFavoriteForDetail(null);
          setIsDetailModalOpen(isOpen);
        }}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-lg font-semibold truncate pr-10">{selectedFavoriteForDetail.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Estilo: {selectedFavoriteForDetail.style}
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-0 flex-grow min-h-0">
              <div className="relative w-full aspect-[4/3] bg-muted/30 md:aspect-auto md:h-full flex items-center justify-center p-4 order-first md:order-none">
                <Image
                  src={selectedFavoriteForDetail.redesignedImage}
                  alt={`Diseño: ${selectedFavoriteForDetail.title}`}
                  fill
                  className="object-contain rounded"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  data-ai-hint="favorite detail"
                />
              </div>

              <div className="flex flex-col order-last md:order-none max-h-full p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant={selectedFavoriteForDetail.userHasLiked ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleUserLike(selectedFavoriteForDetail.id)}
                    >
                      <Heart className="mr-2 h-4 w-4" /> {selectedFavoriteForDetail.userHasLiked ? 'Te gusta' : 'Me gusta'} ({selectedFavoriteForDetail.likes})
                    </Button>
                     <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>{selectedFavoriteForDetail.comments} comentarios</span>
                     </div>
                  </div>
                   <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShareFavoriteFromDetail(selectedFavoriteForDetail.redesignedImage, selectedFavoriteForDetail.title)}
                    title="Compartir diseño"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Creado: {new Date(selectedFavoriteForDetail.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="flex-grow overflow-y-auto py-2">
                  <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground italic p-4 bg-muted/30 rounded-md h-full">
                    <MessageCircle className="h-8 w-8 mb-2 text-muted-foreground/70"/>
                     <p className="font-medium">Comentarios</p>
                     <p className="text-xs mt-2">
                        La visualización y creación de comentarios para favoritos aún no está implementada.
                        <br/>
                        Puedes interactuar con los comentarios de diseños en la página de la Comunidad.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleOpenFindItemsModalFromDetail(selectedFavoriteForDetail)}
                  className="w-full mt-auto"
                >
                  <Search className="mr-2 h-4 w-4" /> Encontrar Artículos Similares (Simulación)
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {favoriteForSimilarItems && (
         <Dialog open={isFindItemsModalOpen} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFavoriteForSimilarItems(null);
          }
          setIsFindItemsModalOpen(isOpen);
        }}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-xl font-semibold text-primary">
                 Artículos: {favoriteForSimilarItems.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Toca un objeto para buscarlo online (simulación).
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-0 flex-grow min-h-0">
              <div className="w-full p-6 md:border-r flex items-center justify-center bg-muted/20 order-first md:order-none">
                <div className="relative w-full max-w-md aspect-[4/3] bg-background rounded-lg shadow-xl overflow-hidden border">
                  <Image
                    src={favoriteForSimilarItems.redesignedImage}
                    alt={`Habitación rediseñada: ${favoriteForSimilarItems.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 448px"
                    className="object-contain"
                    data-ai-hint="redesigned room item search"
                  />
                </div>
              </div>

              <div className="flex flex-col min-h-0 order-last md:order-none">
                {isLoadingSimilarItems && (
                  <div className="flex flex-col items-center justify-center h-full py-10 flex-grow p-6">
                    <LoadingSpinner text="La IA (simulada) está identificando artículos..." size={10}/>
                  </div>
                )}
                {!isLoadingSimilarItems && similarItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-10 flex-grow p-6 text-center">
                    <Alert variant="default" className="max-w-sm bg-card border-border">
                      <Info className="h-5 w-5" />
                      <AlertTitle>No se Encontró Nada (Simulación)</AlertTitle>
                      <AlertDescription className="text-xs">
                        La simulación de IA no pudo identificar artículos distintos en esta imagen.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                {!isLoadingSimilarItems && similarItems.length > 0 && (
                  <ScrollArea className="flex-grow p-4 min-h-0">
                    <div className="space-y-2">
                      {similarItems.map((item, index) => (
                        <a
                          key={index}
                          href={`https://www.google.com/search?tbm=shop&gl=CL&hl=es&q=${encodeURIComponent(item.suggestedSearchQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-between p-3 rounded-md transition-colors group",
                            "bg-card hover:bg-accent/50 border border-border hover:border-primary/50"
                          )}
                          aria-label={`Buscar "${item.itemName}" en Google Shopping`}
                        >
                          <span className="font-medium text-sm text-card-foreground group-hover:text-primary truncate pr-2" title={item.itemName}>
                            {item.itemName}
                          </span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
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
