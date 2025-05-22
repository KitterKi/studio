
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Image as ImageIcon, Sparkles, Home } from 'lucide-react';

interface RedesignPreviewProps {
  originalImageSrc?: string | null;
  redesignedImageSrc?: string | null;
  isLoading: boolean;
}

const ImagePlaceholder = ({ icon: Icon, text, subtext }: { icon: React.ElementType, text: string, subtext?: string }) => (
  <div className="aspect-video w-full bg-card/50 rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground p-3 sm:p-4 shadow-inner border-2 border-dashed border-border/40 min-h-[150px] sm:min-h-[200px] md:min-h-[220px]">
    <Icon className="h-8 w-8 sm:h-10 sm:w-10 mb-2 sm:mb-3 text-muted-foreground/50" />
    <p className="text-xs sm:text-sm font-semibold text-foreground/80">{text}</p>
    {subtext && <p className="text-[10px] sm:text-xs mt-1">{subtext}</p>}
  </div>
);

export default function RedesignPreview({ originalImageSrc, redesignedImageSrc, isLoading }: RedesignPreviewProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-center text-primary mb-2 md:mb-3 tracking-tight">Original</h3>
        <div className="rounded-2xl overflow-hidden border-2 border-border/30 bg-card shadow-xl p-1">
          {originalImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10 rounded-xl overflow-hidden">
              <Image
                src={originalImageSrc}
                alt="Habitación original"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-0.5" 
                data-ai-hint="room interior"
              />
            </div>
          ) : (
            <ImagePlaceholder icon={Home} text="Tu Espacio Actual" subtext="Sube una foto para comenzar." />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-center text-accent mb-2 md:mb-3 tracking-tight">Rediseño IA (Simulado)</h3>
        <div className="rounded-2xl overflow-hidden border-2 border-accent/40 bg-card shadow-xl p-1">
          {isLoading ? (
            <div className="aspect-video w-full flex items-center justify-center bg-card/50 min-h-[150px] sm:min-h-[200px] md:min-h-[220px] rounded-xl">
              <LoadingSpinner size={8} text="La IA está reimaginando tu espacio..." /> 
            </div>
          ) : redesignedImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10 rounded-xl overflow-hidden">
               <Image
                src={redesignedImageSrc}
                alt="Habitación rediseñada"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-0.5" 
                data-ai-hint="redesigned room"
              />
            </div>
          ) : (
            <ImagePlaceholder icon={Sparkles} text="Transformación Mágica" subtext="Tu habitación rediseñada aparecerá aquí." />
          )}
        </div>
      </div>
    </div>
  );
}
