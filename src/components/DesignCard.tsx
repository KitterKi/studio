
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Heart, MoreHorizontal } from 'lucide-react'; // Removed Edit3 from here
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React from 'react';
import type { Comment } from '@/app/(app)/community/page';

export interface DesignCardProps {
  id: string;
  imageUrl: string;
  title: string;
  userName: string;
  userAvatarUrl?: string;
  likes: number;
  comments: number;
  commentsData?: Comment[];
  dataAiHint?: string;
  onImageClick?: () => void;
  isImageClickable?: boolean;
  variant?: 'default' | 'communityFeed';
  index?: number;
  isLikedByCurrentUser?: boolean;
  onLikeClick?: (() => void) | null;
  onOpenComments?: () => void;
  // onEditTitle?: () => void; // Removed prop
}

export default function DesignCard({
  id,
  imageUrl,
  title,
  userName,
  userAvatarUrl,
  likes,
  comments,
  commentsData,
  dataAiHint,
  onImageClick,
  isImageClickable,
  variant = 'default',
  index = 0,
  isLikedByCurrentUser = false,
  onLikeClick,
  onOpenComments,
  // onEditTitle, // Removed prop
}: DesignCardProps) {

  const displayCommentCount = commentsData ? commentsData.length : comments;

  const [imgWidth, imgHeight] = React.useMemo(() => {
    if (imageUrl && imageUrl.includes('placehold.co')) {
      const match = imageUrl.match(/placehold\.co\/(\d+)x(\d+)/);
      if (match && match[1] && match[2]) {
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
      }
    }
    // Default or fallback dimensions if parsing fails or URL is not placehold.co
    // These are just aspect ratio guides if we can't parse, next/image with fill will handle actual rendering.
    return [600, 400];
  }, [imageUrl]);

  if (variant === 'communityFeed') {
    return (
      <Card
        className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group relative break-inside-avoid-column"
      >
        <div
          className={cn("w-full bg-muted/0", (isImageClickable || onOpenComments) && "cursor-pointer")} // Removed bg-muted
          onClick={onOpenComments ? onOpenComments : (isImageClickable ? onImageClick : undefined)}
        >
          <Image
            src={imageUrl}
            alt={title || 'Diseño de usuario'}
            width={imgWidth} // Use parsed or default width
            height={imgHeight} // Use parsed or default height
            className="object-cover w-full h-auto block" // w-full h-auto for responsiveness
            data-ai-hint={dataAiHint || "diseño de interiores"}
            priority={index < 4}
          />
        </div>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
          <Link href={`/u/${encodeURIComponent(userName)}`} className="flex items-center gap-2 group/userlink" onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-7 w-7 border-2 border-white/60 group-hover/userlink:ring-2 group-hover/userlink:ring-white transition-all">
              <AvatarImage src={userAvatarUrl || `https://placehold.co/40x40.png?text=${userName?.substring(0,1)}`} alt={userName || 'Avatar de usuario'} data-ai-hint="profile avatar small"/>
              <AvatarFallback className="text-xs">{userName?.substring(0, 1).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-white truncate group-hover/userlink:underline">{userName}</span>
          </Link>
          <div className="flex items-center gap-2">
            {onOpenComments && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-white hover:bg-white/20 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenComments();
                }}
                aria-label="Ver comentarios"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{displayCommentCount}</span>
              </Button>
            )}
            {onLikeClick !== null && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-white hover:bg-white/20 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if(onLikeClick) onLikeClick();
                }}
                aria-pressed={isLikedByCurrentUser}
                aria-label={isLikedByCurrentUser ? "Quitar me gusta" : "Dar me gusta"}
              >
                <Heart className={cn("h-4 w-4", isLikedByCurrentUser && "fill-red-500 text-red-500")} />
                <span className="text-xs">{likes}</span>
              </Button>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/60 h-8 w-8 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-300 rounded-full" aria-label="Más opciones" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </Card>
    );
  }

  // Default variant (for Favorites page etc.)
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-4 flex justify-between items-center">
        <CardTitle className="text-lg truncate">{title}</CardTitle>
        {/* Removed Edit3 button from here */}
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
          {onLikeClick !== null && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 p-1 h-auto hover:bg-accent/50"
              onClick={onLikeClick}
              aria-pressed={isLikedByCurrentUser}
              aria-label={isLikedByCurrentUser ? "Quitar me gusta" : "Dar me gusta"}
            >
              <Heart className={cn("h-4 w-4", isLikedByCurrentUser && "fill-destructive text-destructive")} />
              <span className="text-xs">{likes}</span>
            </Button>
          )}
           {onOpenComments && (
             <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 p-1 h-auto hover:bg-accent/50"
                onClick={onOpenComments}
                aria-label="Ver comentarios"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{displayCommentCount}</span>
              </Button>
           )}
        </div>
      </CardFooter>
    </Card>
  );
}
