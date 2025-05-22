import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export default function DesignCard({ id, imageUrl, title, userName, userAvatarUrl, likes, comments, dataAiHint, onImageClick, isImageClickable }: DesignCardProps) {
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
            alt={title || 'User design'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={dataAiHint || "interior design"}
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-card">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatarUrl || `https://placehold.co/40x40.png?text=${userName.substring(0,1)}`} alt={userName} data-ai-hint="profile avatar" />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
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
