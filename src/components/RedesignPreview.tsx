
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface RedesignPreviewProps {
  originalImageSrc?: string | null;
  redesignedImageSrc?: string | null;
  isLoading: boolean;
}

const ImagePlaceholder = ({ text }: { text: string }) => (
  <div className="aspect-video w-full bg-muted/50 rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4 shadow-inner">
    <ImageIcon className="h-12 w-12 mb-2" />
    <p className="text-sm text-center">{text}</p>
  </div>
);

export default function RedesignPreview({ originalImageSrc, redesignedImageSrc, isLoading }: RedesignPreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ImageIcon className="h-5 w-5" />
            Habitación Original
          </CardTitle>
        </CardHeader>
        <CardContent>
          {originalImageSrc ? (
            <div className="aspect-video relative w-full rounded-lg overflow-hidden border">
              <Image
                src={originalImageSrc}
                alt="Habitación original"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                data-ai-hint="room interior"
              />
            </div>
          ) : (
            <ImagePlaceholder text="Sube una foto de tu habitación para verla aquí." />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Habitación Rediseñada
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="aspect-video w-full flex items-center justify-center bg-muted/50 rounded-lg">
              <LoadingSpinner size={16} text="La IA está haciendo su magia..." />
            </div>
          ) : redesignedImageSrc ? (
            <div className="aspect-video relative w-full rounded-lg overflow-hidden border">
               <Image
                src={redesignedImageSrc}
                alt="Habitación rediseñada"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                data-ai-hint="redesigned room"
              />
            </div>
          ) : (
            <ImagePlaceholder text="Tu habitación rediseñada por IA aparecerá aquí." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
