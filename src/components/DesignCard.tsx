
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface DesignCardProps {
  id: string;
  imageUrl: string;
  title: string;
  userName: string;
  userAvatarUrl?: string;
  likes: number;
  comments: number;
  dataAiHint?: string;
  onImageClick?: () => void;
  isImageClickable?: boolean;
  variant?: 'default' | 'communityFeed';
}

export default function DesignCard({ 
  id, 
  imageUrl, 
  title, 
  userName, 
  userAvatarUrl, 
  likes, 
  comments, 
  dataAiHint, 
  onImageClick, 
  isImageClickable,
  variant = 'default' 
}: DesignCardProps) {
  
  if (variant === 'communityFeed') {
    return (
      <Card 
        className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group relative"
        onClick={isImageClickable ? onImageClick : undefined}
      >
        <div className={cn("aspect-auto w-full", isImageClickable && "cursor-pointer")}>
          <Image
            src={imageUrl}
            alt={title || 'Diseño de usuario'}
            width={600} // Provide base width, height will be auto based on aspect ratio
            height={800} // Provide base height, used for initial calculation, then auto
            className="object-cover w-full h-auto" // h-auto is key for masonry
            data-ai-hint={dataAiHint || "diseño de interiores"}
            priority={false} // consider true for above-the-fold images if any
          />
        </div>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border-2 border-white/60">
              <AvatarImage src={userAvatarUrl || `https://placehold.co/40x40.png?text=${userName?.substring(0,1)}`} alt={userName || 'Avatar de usuario'} data-ai-hint="profile avatar small"/>
              <AvatarFallback className="text-xs">{userName?.substring(0, 1).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-white truncate">{userName}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/60 h-8 w-8 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-300 rounded-full" aria-label="Más opciones">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn("p-0 flex-grow", isImageClickable && "cursor-pointer")}
        onClick={isImageClickable ? onImageClick : undefined}
      >
        <div className="aspect-[4/3] relative w-full">
          <Image
            src={imageUrl}
            alt={title || 'Diseño de usuario'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={dataAiHint || "diseño de interiores"}
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-card">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatarUrl || `https://placehold.co/40x40.png?text=${userName?.substring(0,1)}`} alt={userName || 'Avatar de usuario'} data-ai-hint="profile avatar" />
            <AvatarFallback>{userName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-card-foreground">{userName}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
