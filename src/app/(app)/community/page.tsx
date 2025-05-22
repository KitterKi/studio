
'use client'; 

import DesignCard, { type DesignCardProps } from '@/components/DesignCard';
import { useAuth } from '@/hooks/useAuth'; 

// Adjusted MOCK_DESIGNS with more varied aspect ratios and descriptive hints
const MOCK_DESIGNS: Omit<DesignCardProps, 'variant' | 'likes' | 'comments' | 'id' | 'onImageClick' | 'isImageClickable'>[] = [
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
        // Cambiado a un layout de grid de dos columnas en pantallas pequeñas y más en grandes
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4"> 
          {MOCK_DESIGNS.map((design, index) => (
            <div key={`design-${index}`} className="break-inside-avoid"> {/* break-inside-avoid es más para masonry, pero no daña aquí */}
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
