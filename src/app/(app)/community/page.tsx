import DesignCard, { type DesignCardProps } from '@/components/DesignCard';

const MOCK_DESIGNS: DesignCardProps[] = [
  { id: '1', imageUrl: 'https://placehold.co/600x450.png', title: 'Modern Living Room Transformation', userName: 'Alice Wonderland', userAvatarUrl: 'https://placehold.co/40x40.png?text=AW', likes: 120, comments: 15, dataAiHint: "living room" },
  { id: '2', imageUrl: 'https://placehold.co/600x450.png', title: 'Rustic Bedroom Oasis', userName: 'Bob The Builder', userAvatarUrl: 'https://placehold.co/40x40.png?text=BB', likes: 95, comments: 8, dataAiHint: "bedroom" },
  { id: '3', imageUrl: 'https://placehold.co/600x450.png', title: 'Minimalist Kitchen Concept', userName: 'Carol Danvers', userAvatarUrl: 'https://placehold.co/40x40.png?text=CD', likes: 210, comments: 22, dataAiHint: "kitchen" },
  { id: '4', imageUrl: 'https://placehold.co/600x450.png', title: 'Bohemian Balcony Retreat', userName: 'David Copperfield', userAvatarUrl: 'https://placehold.co/40x40.png?text=DC', likes: 78, comments: 5, dataAiHint: "balcony" },
  { id: '5', imageUrl: 'https://placehold.co/600x450.png', title: 'Industrial Home Office', userName: 'Eve Harrington', userAvatarUrl: 'https://placehold.co/40x40.png?text=EH', likes: 150, comments: 12, dataAiHint: "home office" },
  { id: '6', imageUrl: 'https://placehold.co/600x450.png', title: 'Coastal Inspired Bathroom', userName: 'Frankenstein', userAvatarUrl: 'https://placehold.co/40x40.png?text=F', likes: 60, comments: 3, dataAiHint: "bathroom" },
];


export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Community Designs
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
          Explore designs shared by our talented community. Get inspired and share your own!
        </p>
      </div>

      {MOCK_DESIGNS.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_DESIGNS.map((design) => (
            <DesignCard key={design.id} {...design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No designs shared yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}
