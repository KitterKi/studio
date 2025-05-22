
'use client';

import { useState } from 'react';
import DesignCard, { type DesignCardProps } from '@/components/DesignCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Adjusted MOCK_DESIGNS with more varied aspect ratios and descriptive hints
const ALL_MOCK_DESIGNS: Omit<DesignCardProps, 'variant' | 'likes' | 'comments' | 'id' | 'onImageClick' | 'isImageClickable'>[] = [
  { imageUrl: 'https://placehold.co/600x400.png', title: 'Sala Moderna Espaciosa', userName: 'Alicia M.', userAvatarUrl: 'https://placehold.co/40x40.png?text=AM', dataAiHint: "modern living room" },
  { imageUrl: 'https://placehold.co/500x750.png', title: 'Dormitorio Rústico Acogedor', userName: 'Bob C.', userAvatarUrl: 'https://placehold.co/40x40.png?text=BC', dataAiHint: "rustic bedroom" },
  { imageUrl: 'https://placehold.co/700x500.png', title: 'Cocina Minimalista y Luminosa', userName: 'Carolina D.', userAvatarUrl: 'https://placehold.co/40x40.png?text=CD', dataAiHint: "minimalist kitchen" },
  { imageUrl: 'https://placehold.co/450x600.png', title: 'Balcón Bohemio con Plantas', userName: 'David C.', userAvatarUrl: 'https://placehold.co/40x40.png?text=DC', dataAiHint: "bohemian balcony" },
  { imageUrl: 'https://placehold.co/800x600.png', title: 'Oficina Industrial en Casa', userName: 'Eva H.', userAvatarUrl: 'https://placehold.co/40x40.png?text=EH', dataAiHint: "industrial home office" },
  { imageUrl: 'https://placehold.co/600x450.png', title: 'Baño Costero Relajante', userName: 'Frank G.', userAvatarUrl: 'https://placehold.co/40x40.png?text=FG', dataAiHint: "coastal bathroom" },
  { imageUrl: 'https://placehold.co/550x700.png', title: 'Comedor Escandinavo Simple', userName: 'Gloria P.', userAvatarUrl: 'https://placehold.co/40x40.png?text=GP', dataAiHint: "scandinavian dining" },
  { imageUrl: 'https://placehold.co/750x550.png', title: 'Terraza Japandi Tranquila', userName: 'Hector L.', userAvatarUrl: 'https://placehold.co/40x40.png?text=HL', dataAiHint: "japandi terrace" },
  { imageUrl: 'https://placehold.co/650x800.png', title: 'Estudio Art Deco Elegante', userName: 'Ines V.', userAvatarUrl: 'https://placehold.co/40x40.png?text=IV', dataAiHint: "art deco study" },
  { imageUrl: 'https://placehold.co/500x500.png', title: 'Patio Maximalista Vibrante', userName: 'Juan K.', userAvatarUrl: 'https://placehold.co/40x40.png?text=JK', dataAiHint: "maximalist patio" },
  { imageUrl: 'https://placehold.co/620x420.png', title: 'Entrada Tradicional', userName: 'Laura B.', userAvatarUrl: 'https://placehold.co/40x40.png?text=LB', dataAiHint: "traditional entryway" },
  { imageUrl: 'https://placehold.co/480x680.png', title: 'Cuarto Infantil Juguetón', userName: 'Miguel S.', userAvatarUrl: 'https://placehold.co/40x40.png?text=MS', dataAiHint: "playful kidsroom" },
  { imageUrl: 'https://placehold.co/720x520.png', title: 'Sótano Moderno', userName: 'Nora F.', userAvatarUrl: 'https://placehold.co/40x40.png?text=NF', dataAiHint: "modern basement" },
  { imageUrl: 'https://placehold.co/430x580.png', title: 'Ático Chic Urbano', userName: 'Oscar P.', userAvatarUrl: 'https://placehold.co/40x40.png?text=OP', dataAiHint: "urban chic attic" },
  { imageUrl: 'https://placehold.co/820x620.png', title: 'Estudio de Música en Casa', userName: 'Paula R.', userAvatarUrl: 'https://placehold.co/40x40.png?text=PR', dataAiHint: "home music studio" },
];

const ITEMS_PER_PAGE = 6;

export default function CommunityPage() {
  const { user } = useAuth();
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };

  const displayedDesigns = ALL_MOCK_DESIGNS.slice(0, visibleItems);
  const canLoadMore = visibleItems < ALL_MOCK_DESIGNS.length;

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

      {ALL_MOCK_DESIGNS.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
            {displayedDesigns.map((design, index) => (
              <DesignCard
                key={`community-design-${index}`}
                id={`design-${index}`}
                imageUrl={design.imageUrl}
                title={design.title}
                userName={design.userName}
                userAvatarUrl={design.userAvatarUrl}
                likes={0} // Not displayed in communityFeed variant
                comments={0} // Not displayed in communityFeed variant
                dataAiHint={design.dataAiHint}
                variant="communityFeed"
                index={index}
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
