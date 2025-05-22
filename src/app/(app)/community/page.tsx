
'use client';

import { useState } from 'react';
import DesignCard, { type DesignCardProps } from '@/components/DesignCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Adjusted MOCK_DESIGNS with IDs, likes as numbers, and isLikedByCurrentUser
const INITIAL_MOCK_DESIGNS: Omit<DesignCardProps, 'variant' | 'comments' | 'onImageClick' | 'isImageClickable'>[] = [
  { id: 'comm-1', imageUrl: 'https://placehold.co/600x400.png', title: 'Sala Moderna Espaciosa', userName: 'Alicia M.', userAvatarUrl: 'https://placehold.co/40x40.png?text=AM', dataAiHint: "modern living room", likes: 120, isLikedByCurrentUser: false },
  { id: 'comm-2', imageUrl: 'https://placehold.co/500x750.png', title: 'Dormitorio Rústico Acogedor', userName: 'Bob C.', userAvatarUrl: 'https://placehold.co/40x40.png?text=BC', dataAiHint: "rustic bedroom", likes: 95, isLikedByCurrentUser: false },
  { id: 'comm-3', imageUrl: 'https://placehold.co/700x500.png', title: 'Cocina Minimalista y Luminosa', userName: 'Carolina D.', userAvatarUrl: 'https://placehold.co/40x40.png?text=CD', dataAiHint: "minimalist kitchen", likes: 210, isLikedByCurrentUser: false },
  { id: 'comm-4', imageUrl: 'https://placehold.co/450x600.png', title: 'Balcón Bohemio con Plantas', userName: 'David C.', userAvatarUrl: 'https://placehold.co/40x40.png?text=DC', dataAiHint: "bohemian balcony", likes: 78, isLikedByCurrentUser: false },
  { id: 'comm-5', imageUrl: 'https://placehold.co/800x600.png', title: 'Oficina Industrial en Casa', userName: 'Eva H.', userAvatarUrl: 'https://placehold.co/40x40.png?text=EH', dataAiHint: "industrial home office", likes: 150, isLikedByCurrentUser: false },
  { id: 'comm-6', imageUrl: 'https://placehold.co/600x450.png', title: 'Baño Costero Relajante', userName: 'Frank G.', userAvatarUrl: 'https://placehold.co/40x40.png?text=FG', dataAiHint: "coastal bathroom", likes: 60, isLikedByCurrentUser: false },
  { id: 'comm-7', imageUrl: 'https://placehold.co/550x700.png', title: 'Comedor Escandinavo Simple', userName: 'Gloria P.', userAvatarUrl: 'https://placehold.co/40x40.png?text=GP', dataAiHint: "scandinavian dining", likes: 115, isLikedByCurrentUser: false },
  { id: 'comm-8', imageUrl: 'https://placehold.co/750x550.png', title: 'Terraza Japandi Tranquila', userName: 'Hector L.', userAvatarUrl: 'https://placehold.co/40x40.png?text=HL', dataAiHint: "japandi terrace", likes: 99, isLikedByCurrentUser: false },
  { id: 'comm-9', imageUrl: 'https://placehold.co/650x800.png', title: 'Estudio Art Deco Elegante', userName: 'Ines V.', userAvatarUrl: 'https://placehold.co/40x40.png?text=IV', dataAiHint: "art deco study", likes: 133, isLikedByCurrentUser: false },
  { id: 'comm-10', imageUrl: 'https://placehold.co/500x500.png', title: 'Patio Maximalista Vibrante', userName: 'Juan K.', userAvatarUrl: 'https://placehold.co/40x40.png?text=JK', dataAiHint: "maximalist patio", likes: 88, isLikedByCurrentUser: false },
  { id: 'comm-11', imageUrl: 'https://placehold.co/620x420.png', title: 'Entrada Tradicional', userName: 'Laura B.', userAvatarUrl: 'https://placehold.co/40x40.png?text=LB', dataAiHint: "traditional entryway", likes: 55, isLikedByCurrentUser: false },
  { id: 'comm-12', imageUrl: 'https://placehold.co/480x680.png', title: 'Cuarto Infantil Juguetón', userName: 'Miguel S.', userAvatarUrl: 'https://placehold.co/40x40.png?text=MS', dataAiHint: "playful kidsroom", likes: 170, isLikedByCurrentUser: false },
  { id: 'comm-13', imageUrl: 'https://placehold.co/720x520.png', title: 'Sótano Moderno', userName: 'Nora F.', userAvatarUrl: 'https://placehold.co/40x40.png?text=NF', dataAiHint: "modern basement", likes: 105, isLikedByCurrentUser: false },
  { id: 'comm-14', imageUrl: 'https://placehold.co/430x580.png', title: 'Ático Chic Urbano', userName: 'Oscar P.', userAvatarUrl: 'https://placehold.co/40x40.png?text=OP', dataAiHint: "urban chic attic", likes: 190, isLikedByCurrentUser: false },
  { id: 'comm-15', imageUrl: 'https://placehold.co/820x620.png', title: 'Estudio de Música en Casa', userName: 'Paula R.', userAvatarUrl: 'https://placehold.co/40x40.png?text=PR', dataAiHint: "home music studio", likes: 162, isLikedByCurrentUser: false },
];

const ITEMS_PER_PAGE = 6;

export default function CommunityPage() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState(INITIAL_MOCK_DESIGNS.map(d => ({...d, comments: d.comments || 0 })));
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  const displayedDesigns = designs.slice(0, visibleItems);
  const canLoadMore = visibleItems < designs.length;

  return (
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
                comments={design.comments || 0} // Ensure comments is a number
                dataAiHint={design.dataAiHint}
                variant="communityFeed"
                index={index}
                isLikedByCurrentUser={design.isLikedByCurrentUser}
                onLikeClick={user ? () => handleToggleLike(design.id) : undefined} // Only allow like if user is logged in
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
  );
}

    