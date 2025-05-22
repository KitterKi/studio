
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface RedesignPreviewProps {
  originalImageSrc?: string | null;
  redesignedImageSrc?: string | null;
  isLoading: boolean;
}

const ImagePlaceholder = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="aspect-video w-full bg-muted/20 rounded-lg flex flex-col items-center justify-center text-muted-foreground p-6 shadow-inner border-2 border-dashed border-muted/40 min-h-[200px]">
    <Icon className="h-12 w-12 mb-4 text-muted-foreground/60" />
    <p className="text-sm text-center font-medium">{text}</p>
  </div>
);

export default function RedesignPreview({ originalImageSrc, redesignedImageSrc, isLoading }: RedesignPreviewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-center text-foreground mb-4">Original</h3>
        <div className="rounded-xl overflow-hidden border-2 border-muted/30 bg-card shadow-xl">
          {originalImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10">
              <Image
                src={originalImageSrc}
                alt="Habitación original"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-1" // Added p-1 for a slight inset
                data-ai-hint="room interior"
              />
            </div>
          ) : (
            <ImagePlaceholder icon={ImageIcon} text="Sube una foto de tu habitación para verla aquí." />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-center text-foreground mb-4">Rediseño IA</h3>
        <div className="rounded-xl overflow-hidden border-2 border-primary/40 bg-card shadow-xl">
          {isLoading ? (
            <div className="aspect-video w-full flex items-center justify-center bg-muted/20 min-h-[200px]">
              <LoadingSpinner size={16} text="La IA está haciendo su magia..." />
            </div>
          ) : redesignedImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10">
               <Image
                src={redesignedImageSrc}
                alt="Habitación rediseñada"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-1" // Added p-1 for a slight inset
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
