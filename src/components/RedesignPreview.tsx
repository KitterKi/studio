
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Image as ImageIcon, Sparkles, Home } from 'lucide-react';

interface RedesignPreviewProps {
  originalImageSrc?: string | null;
  redesignedImageSrc?: string | null;
  isLoading: boolean;
}

const ImagePlaceholder = ({ icon: Icon, text, subtext }: { icon: React.ElementType, text: string, subtext?: string }) => (
  <div className="aspect-video w-full bg-card/50 rounded-lg flex flex-col items-center justify-center text-center text-muted-foreground p-2 shadow-inner border-2 border-dashed border-border/40 min-h-[150px] sm:min-h-[200px] md:min-h-[220px] 
                 sm:p-3">
    <Icon className="h-6 w-6 mb-1.5 text-muted-foreground/50 
                   sm:h-8 sm:w-8 sm:mb-2" />
    <p className="text-[10px] font-semibold text-foreground/80 
                   sm:text-xs sm:font-semibold">{text}</p>
    {subtext && <p className="text-[9px] mt-0.5 sm:text-[10px]">{subtext}</p>}
  </div>
);

export default function RedesignPreview({ originalImageSrc, redesignedImageSrc, isLoading }: RedesignPreviewProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-center text-primary mb-2 md:mb-3 tracking-tight">Original</h3>
        <div className="rounded-lg overflow-hidden border-2 border-border/30 bg-card shadow-lg p-0.5 sm:p-1">
          {originalImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10 rounded-md overflow-hidden">
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
        <h3 className="text-xl md:text-2xl font-bold text-center text-accent mb-2 md:mb-3 tracking-tight">Rediseño IA</h3>
        <div className="rounded-lg overflow-hidden border-2 border-accent/40 bg-card shadow-lg p-0.5 sm:p-1">
          {isLoading ? (
            <div className="aspect-video w-full flex items-center justify-center bg-card/50 min-h-[150px] sm:min-h-[200px] md:min-h-[220px] rounded-md">
              <LoadingSpinner size={10} text="La IA está reimaginando tu espacio..." /> 
            </div>
          ) : redesignedImageSrc ? (
            <div className="aspect-video relative w-full bg-muted/10 rounded-md overflow-hidden">
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
