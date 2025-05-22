
'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import DesignCard, { type DesignCardProps as FullDesignCardProps } from '@/components/DesignCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';


export interface Comment {
  id: string;
  text: string;
  userName: string;
  userAvatarUrl: string;
  timestamp: number; // Store as Unix timestamp (ms)
}

// Redefine Design type for this page, including commentsData
interface CommunityDesign extends Omit<FullDesignCardProps, 'variant' | 'comments' | 'onImageClick' | 'isImageClickable' | 'onOpenComments' | 'commentsData'> {
  commentsData: Comment[];
  // 'comments' prop will be derived dynamically as commentsData.length
}


const INITIAL_MOCK_DESIGNS_RAW: Omit<CommunityDesign, 'commentsData'>[] = [
  { id: 'comm-1', imageUrl: 'https://placehold.co/600x800.png', title: 'Sala de Estar Moderna y Espaciosa', userName: 'Alicia M.', userAvatarUrl: 'https://placehold.co/40x40.png?text=AM', dataAiHint: "living room", likes: 120, isLikedByCurrentUser: false },
  { id: 'comm-2', imageUrl: 'https://placehold.co/500x750.png', title: 'Dormitorio Rústico Acogedor', userName: 'Bob C.', userAvatarUrl: 'https://placehold.co/40x40.png?text=BC', dataAiHint: "rustic bedroom", likes: 95, isLikedByCurrentUser: false },
  { id: 'comm-3', imageUrl: 'https://placehold.co/700x500.png', title: 'Cocina Minimalista y Luminosa', userName: 'Carolina D.', userAvatarUrl: 'https://placehold.co/40x40.png?text=CD', dataAiHint: "minimalist kitchen", likes: 210, isLikedByCurrentUser: false },
  { id: 'comm-4', imageUrl: 'https://placehold.co/450x600.png', title: 'Balcón Bohemio Lleno de Plantas', userName: 'David E.', userAvatarUrl: 'https://placehold.co/40x40.png?text=DE', dataAiHint: "bohemian balcony", likes: 78, isLikedByCurrentUser: false },
  { id: 'comm-5', imageUrl: 'https://placehold.co/800x600.png', title: 'Oficina Industrial en Casa', userName: 'Eva H.', userAvatarUrl: 'https://placehold.co/40x40.png?text=EH', dataAiHint: "industrial office", likes: 150, isLikedByCurrentUser: false },
  { id: 'comm-6', imageUrl: 'https://placehold.co/600x450.png', title: 'Baño Estilo Costero Relajante', userName: 'Frank G.', userAvatarUrl: 'https://placehold.co/40x40.png?text=FG', dataAiHint: "coastal bathroom", likes: 60, isLikedByCurrentUser: false },
  { id: 'comm-7', imageUrl: 'https://placehold.co/550x700.png', title: 'Comedor Escandinavo Sencillo', userName: 'Gloria P.', userAvatarUrl: 'https://placehold.co/40x40.png?text=GP', dataAiHint: "scandinavian dining", likes: 115, isLikedByCurrentUser: false },
  { id: 'comm-8', imageUrl: 'https://placehold.co/750x550.png', title: 'Terraza Japandi Tranquila', userName: 'Hector L.', userAvatarUrl: 'https://placehold.co/40x40.png?text=HL', dataAiHint: "japandi terrace", likes: 99, isLikedByCurrentUser: false },
  { id: 'comm-9', imageUrl: 'https://placehold.co/650x800.png', title: 'Estudio Art Deco Elegante', userName: 'Ines V.', userAvatarUrl: 'https://placehold.co/40x40.png?text=IV', dataAiHint: "deco study", likes: 133, isLikedByCurrentUser: false },
  { id: 'comm-10', imageUrl: 'https://placehold.co/500x500.png', title: 'Patio Maximalista Vibrante', userName: 'Juan K.', userAvatarUrl: 'https://placehold.co/40x40.png?text=JK', dataAiHint: "maximalist patio", likes: 88, isLikedByCurrentUser: false },
  { id: 'comm-11', imageUrl: 'https://placehold.co/620x420.png', title: 'Entrada Tradicional Iluminada', userName: 'Laura B.', userAvatarUrl: 'https://placehold.co/40x40.png?text=LB', dataAiHint: "traditional entryway", likes: 55, isLikedByCurrentUser: false },
  { id: 'comm-12', imageUrl: 'https://placehold.co/480x680.png', title: 'Cuarto Infantil Juguetón y Colorido', userName: 'Miguel S.', userAvatarUrl: 'https://placehold.co/40x40.png?text=MS', dataAiHint: "kids room", likes: 170, isLikedByCurrentUser: false },
  { id: 'comm-13', imageUrl: 'https://placehold.co/720x520.png', title: 'Sótano Moderno Multifuncional', userName: 'Nora F.', userAvatarUrl: 'https://placehold.co/40x40.png?text=NF', dataAiHint: "modern basement", likes: 105, isLikedByCurrentUser: false },
  { id: 'comm-14', imageUrl: 'https://placehold.co/430x580.png', title: 'Ático Urbano Chic con Vistas', userName: 'Oscar P.', userAvatarUrl: 'https://placehold.co/40x40.png?text=OP', dataAiHint: "urban attic", likes: 190, isLikedByCurrentUser: false },
  { id: 'comm-15', imageUrl: 'https://placehold.co/820x620.png', title: 'Estudio de Música Casero Acústico', userName: 'Paula R.', userAvatarUrl: 'https://placehold.co/40x40.png?text=PR', dataAiHint: "music studio", likes: 162, isLikedByCurrentUser: false },
];

const MOCK_COMMENTS_EXAMPLES: Omit<Comment, 'id' | 'timestamp'>[] = [
  { text: "¡Qué diseño tan increíble!", userName: "Carlos G.", userAvatarUrl: "https://placehold.co/30x30.png?text=CG" },
  { text: "Me encantan los colores que usaste.", userName: "Laura P.", userAvatarUrl: "https://placehold.co/30x30.png?text=LP" },
  { text: "Muy inspirador, gracias por compartir.", userName: "Sofia R.", userAvatarUrl: "https://placehold.co/30x30.png?text=SR" },
];

const INITIAL_MOCK_DESIGNS: CommunityDesign[] = INITIAL_MOCK_DESIGNS_RAW.map((design, index) => ({
  ...design,
  commentsData: index < 3 ? // Add some mock comments to the first few designs
    MOCK_COMMENTS_EXAMPLES.slice(0, (index % 3) + 1).map((comment, cIndex) => ({
      ...comment,
      id: `comment-${design.id}-${cIndex}`,
      timestamp: Date.now() - (cIndex * 1000 * 60 * 5) // Stagger timestamps
    }))
    : [],
}));


const ITEMS_PER_PAGE = 6;

export default function CommunityPage() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<CommunityDesign[]>(INITIAL_MOCK_DESIGNS);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentingDesign, setCommentingDesign] = useState<CommunityDesign | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleToggleLike = (designId: string) => {
    setDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design.id === designId
          ? {
              ...design,
              isLikedByCurrentUser: !design.isLikedByCurrentUser,
              likes: design.isLikedByCurrentUser
                ? (design.likes || 0) - 1
                : (design.likes || 0) + 1,
            }
          : design
      )
    );
  };

  const handleOpenComments = (design: CommunityDesign) => {
    setCommentingDesign(design);
    setIsCommentModalOpen(true);
  };

  const handlePostComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !commentingDesign || !user) return;

    const newComment: Comment = {
      id: `comment-${commentingDesign.id}-${Date.now()}`,
      text: newCommentText.trim(),
      userName: user.name || user.email?.split('@')[0] || 'Usuario Anónimo',
      userAvatarUrl: `https://placehold.co/30x30.png?text=${(user.name || user.email || 'U').substring(0,1)}`,
      timestamp: Date.now(),
    };

    setDesigns(prevDesigns =>
      prevDesigns.map(d =>
        d.id === commentingDesign.id
          ? { ...d, commentsData: [...d.commentsData, newComment] }
          : d
      )
    );
    setCommentingDesign(prev => prev ? {...prev, commentsData: [...prev.commentsData, newComment]} : null);
    setNewCommentText('');
  };


  const displayedDesigns = designs.slice(0, visibleItems);
  const canLoadMore = visibleItems < designs.length;

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Diseños de la Comunidad
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
            Explora diseños compartidos por nuestra talentosa comunidad. Inspírate {user ? '¡y comparte los tuyos!' : 'con otros!'}
          </p>
        </div>

        {designs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              {displayedDesigns.map((design, index) => (
                <DesignCard
                  key={design.id}
                  id={design.id}
                  imageUrl={design.imageUrl}
                  title={design.title}
                  userName={design.userName}
                  userAvatarUrl={design.userAvatarUrl}
                  likes={design.likes || 0}
                  comments={design.commentsData.length}
                  commentsData={design.commentsData}
                  dataAiHint={design.dataAiHint}
                  variant="communityFeed"
                  index={index}
                  isLikedByCurrentUser={design.isLikedByCurrentUser}
                  onLikeClick={user ? () => handleToggleLike(design.id) : undefined}
                  onOpenComments={() => handleOpenComments(design)}
                />
              ))}
            </div>
            {canLoadMore && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore} disabled={isLoadingMore} size="lg">
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Cargar Más Diseños'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Aún no se han compartido diseños. ¡Sé el primero!</p>
          </div>
        )}
      </div>

      {commentingDesign && (
        <Dialog open={isCommentModalOpen} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setCommentingDesign(null);
            setNewCommentText('');
          }
          setIsCommentModalOpen(isOpen);
        }}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Comentarios para "{commentingDesign.title}"</DialogTitle>
               <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute right-4 top-3">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-0 flex-grow min-h-0">
              <div className="relative aspect-square w-full md:aspect-auto md:h-full order-first md:order-none">
                <Image
                  src={commentingDesign.imageUrl}
                  alt={`Diseño: ${commentingDesign.title}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col order-last md:order-none max-h-full">
                <ScrollArea className="flex-grow p-4 min-h-0 max-h-[calc(90vh-200px)] md:max-h-none">
                  {commentingDesign.commentsData.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No hay comentarios aún. ¡Sé el primero!</p>
                  ) : (
                    <ul className="space-y-4">
                      {commentingDesign.commentsData.slice().sort((a,b) => a.timestamp - b.timestamp).map((comment) => (
                        <li key={comment.id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.userAvatarUrl} alt={comment.userName} />
                            <AvatarFallback>{comment.userName.substring(0,1)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{comment.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true, locale: es })}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>

                {user && (
                  <form onSubmit={handlePostComment} className="p-4 border-t bg-background sticky bottom-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${(user.name || user.email || 'U').substring(0,1)}`} alt={user.name || "Tú"} />
                          <AvatarFallback>{(user.name || user.email || 'U').substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <Input
                        type="text"
                        placeholder="Añade un comentario..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="flex-grow"
                        disabled={!user}
                      />
                      <Button type="submit" size="icon" disabled={!newCommentText.trim() || !user}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Publicar comentario</span>
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

