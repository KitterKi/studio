
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Image as ImageIcon, Sparkles, Home } from 'lucide-react';

interface RedesignPreviewProps {
  originalImageSrc?: string | null;
  redesignedImageSrc?: string | null;
  isLoading: boolean;
}

const ImagePlaceholder = ({ icon: Icon, text, subtext }: { icon: React.ElementType, text: string, subtext?: string }) => (
  <div className="aspect-video w-full bg-card/50 rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground p-6 shadow-inner border-2 border-dashed border-border/40 min-h-[250px] sm:min-h-[300px]">
    <Icon className="h-16 w-16 mb-4 text-muted-foreground/50" />
    <p className="text-base font-semibold text-foreground/80">{text}</p>
    {subtext && <p className="text-sm mt-1">{subtext}</p>}
  </div>
);

export default function RedesignPreview({ originalImageSrc, redesignedImageSrc, isLoading }: RedesignPreviewProps) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-bold text-center text-primary mb-4 tracking-tight">Original</h3>
        <div className="rounded-2xl overflow-hidden border-2 border-border/30 bg-card shadow-xl p-1">
          {originalImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10 rounded-xl overflow-hidden">
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
            <ImagePlaceholder icon={Home} text="Tu Espacio Actual" subtext="Sube una foto de tu habitación para comenzar." />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-center text-accent mb-4 tracking-tight">Rediseño IA</h3>
        <div className="rounded-2xl overflow-hidden border-2 border-accent/40 bg-card shadow-xl p-1">
          {isLoading ? (
            <div className="aspect-video w-full flex items-center justify-center bg-card/50 min-h-[250px] sm:min-h-[300px] rounded-xl">
              <LoadingSpinner size={16} text="La IA está reimaginando tu espacio..." />
            </div>
          ) : redesignedImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10 rounded-xl overflow-hidden">
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
            <ImagePlaceholder icon={Sparkles} text="Transformación Mágica" subtext="Tu habitación rediseñada por IA aparecerá aquí." />
          )}
        </div>
      </div>
    </div>
  );
}
