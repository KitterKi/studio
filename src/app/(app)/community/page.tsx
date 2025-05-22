
'use client'; 

import DesignCard, { type DesignCardProps } from '@/components/DesignCard';
import { useAuth } from '@/hooks/useAuth'; 

// Adjusted MOCK_DESIGNS: removed likes, comments as they are not shown in communityFeed variant. Title kept for now as default variant might use it.
const MOCK_DESIGNS: Omit<DesignCardProps, 'variant' | 'likes' | 'comments' | 'id' | 'onImageClick' | 'isImageClickable'>[] = [
  { imageUrl: 'https://placehold.co/600x800.png', title: 'Transformación Moderna de Sala', userName: 'Alicia M.', userAvatarUrl: 'https://placehold.co/40x40.png?text=AM', dataAiHint: "sala moderna" },
  { imageUrl: 'https://placehold.co/600x450.png', title: 'Oasis Rústico de Dormitorio', userName: 'Bob C.', userAvatarUrl: 'https://placehold.co/40x40.png?text=BC', dataAiHint: "dormitorio rustico" },
  { imageUrl: 'https://placehold.co/600x700.png', title: 'Concepto de Cocina Minimalista', userName: 'Carolina D.', userAvatarUrl: 'https://placehold.co/40x40.png?text=CD', dataAiHint: "cocina minimalista" },
  { imageUrl: 'https://placehold.co/600x500.png', title: 'Retiro Bohemio en Balcón', userName: 'David C.', userAvatarUrl: 'https://placehold.co/40x40.png?text=DC', dataAiHint: "balcon bohemio" },
  { imageUrl: 'https://placehold.co/600x750.png', title: 'Oficina en Casa Industrial', userName: 'Eva H.', userAvatarUrl: 'https://placehold.co/40x40.png?text=EH', dataAiHint: "oficina industrial" },
  { imageUrl: 'https://placehold.co/600x400.png', title: 'Baño Inspirado en la Costa', userName: 'Frank G.', userAvatarUrl: 'https://placehold.co/40x40.png?text=FG', dataAiHint: "baño costero" },
  { imageUrl: 'https://placehold.co/600x600.png', title: 'Comedor Escandinavo', userName: 'Gloria P.', userAvatarUrl: 'https://placehold.co/40x40.png?text=GP', dataAiHint: "comedor escandinavo" },
  { imageUrl: 'https://placehold.co/600x850.png', title: 'Terraza Japandi', userName: 'Hector L.', userAvatarUrl: 'https://placehold.co/40x40.png?text=HL', dataAiHint: "terraza japandi" },
];


export default function CommunityPage() {
  const { user } = useAuth(); 

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

      {MOCK_DESIGNS.length > 0 ? (
        <div className="gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 space-y-4 pb-4"> 
          {MOCK_DESIGNS.map((design, index) => (
            <div key={`design-${index}`} className="break-inside-avoid">
              <DesignCard
                id={`design-${index}`}
                imageUrl={design.imageUrl}
                title={design.title}
                userName={design.userName}
                userAvatarUrl={design.userAvatarUrl}
                likes={0} // Not displayed in communityFeed variant
                comments={0} // Not displayed in communityFeed variant
                dataAiHint={design.dataAiHint}
                variant="communityFeed"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Aún no se han compartido diseños. ¡Sé el primero!</p>
        </div>
      )}
    </div>
  );
}
