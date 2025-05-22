
'use client'; 

import DesignCard, { type DesignCardProps } from '@/components/DesignCard';
import { useAuth } from '@/hooks/useAuth'; 

const MOCK_DESIGNS: DesignCardProps[] = [
  { id: '1', imageUrl: 'https://placehold.co/600x450.png', title: 'Transformación Moderna de Sala', userName: 'Alicia Maravillas', userAvatarUrl: 'https://placehold.co/40x40.png?text=AM', likes: 120, comments: 15, dataAiHint: "sala moderna" },
  { id: '2', imageUrl: 'https://placehold.co/600x450.png', title: 'Oasis Rústico de Dormitorio', userName: 'Bob Constructor', userAvatarUrl: 'https://placehold.co/40x40.png?text=BC', likes: 95, comments: 8, dataAiHint: "dormitorio rustico" },
  { id: '3', imageUrl: 'https://placehold.co/600x450.png', title: 'Concepto de Cocina Minimalista', userName: 'Carolina Danvers', userAvatarUrl: 'https://placehold.co/40x40.png?text=CD', likes: 210, comments: 22, dataAiHint: "cocina minimalista" },
  { id: '4', imageUrl: 'https://placehold.co/600x450.png', title: 'Retiro Bohemio en Balcón', userName: 'David Copperfield', userAvatarUrl: 'https://placehold.co/40x40.png?text=DC', likes: 78, comments: 5, dataAiHint: "balcon bohemio" },
  { id: '5', imageUrl: 'https://placehold.co/600x450.png', title: 'Oficina en Casa Industrial', userName: 'Eva Harrington', userAvatarUrl: 'https://placehold.co/40x40.png?text=EH', likes: 150, comments: 12, dataAiHint: "oficina industrial" },
  { id: '6', imageUrl: 'https://placehold.co/600x450.png', title: 'Baño Inspirado en la Costa', userName: 'Frankenstein', userAvatarUrl: 'https://placehold.co/40x40.png?text=F', likes: 60, comments: 3, dataAiHint: "baño costero" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> 
          {MOCK_DESIGNS.map((design) => (
            <DesignCard key={design.id} {...design} />
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
