
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface RedesignPreviewProps {
  originalImageSrc?: string | null;
  redesignedImageSrc?: string | null;
  isLoading: boolean;
}

const ImagePlaceholder = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="aspect-video w-full bg-muted/30 rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4 shadow-inner border border-dashed">
    <Icon className="h-10 w-10 mb-3 text-muted-foreground/70" />
    <p className="text-xs text-center">{text}</p>
  </div>
);

export default function RedesignPreview({ originalImageSrc, redesignedImageSrc, isLoading }: RedesignPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-center text-muted-foreground mb-3">Original</h3>
        <div className="rounded-xl overflow-hidden border bg-card shadow-lg">
          {originalImageSrc ? (
            <div className="aspect-video relative w-full">
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
            <ImagePlaceholder icon={ImageIcon} text="Sube una foto de tu habitación para verla aquí." />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-center text-muted-foreground mb-3">Rediseño IA</h3>
        <div className="rounded-xl overflow-hidden border bg-card shadow-lg">
          {isLoading ? (
            <div className="aspect-video w-full flex items-center justify-center bg-muted/30">
              <LoadingSpinner size={12} text="La IA está haciendo su magia..." />
            </div>
          ) : redesignedImageSrc ? (
            <div className="aspect-video relative w-full">
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
            <ImagePlaceholder icon={Sparkles} text="Tu habitación rediseñada por IA aparecerá aquí." />
          )}
        </div>
      </div>
    </div>
  );
}
