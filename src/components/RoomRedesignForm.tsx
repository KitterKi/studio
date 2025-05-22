
'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DESIGN_STYLES } from '@/lib/constants';
import { UploadCloud, Palette, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoomRedesignFormProps {
  onSubmit: (photoDataUri: string, style: string) => Promise<void>;
  isLoading: boolean;
  isSubmitDisabled?: boolean;
}

export default function RoomRedesignForm({ onSubmit, isLoading, isSubmitDisabled }: RoomRedesignFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        toast({
          variant: "destructive",
          title: "Archivo demasiado grande",
          description: "Por favor, sube una imagen de menos de 4MB.",
        });
        setPhotoPreview(null);
        setPhotoFile(null);
        event.target.value = ''; 
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('[RoomRedesignForm] handleSubmit triggered');
    console.log('[RoomRedesignForm] photoPreview:', !!photoPreview, 'selectedStyle:', selectedStyle, 'photoFile:', !!photoFile);
    console.log('[RoomRedesignForm] isLoading (prop):', isLoading, 'isSubmitDisabled (prop):', isSubmitDisabled);
    
    if (!photoPreview || !selectedStyle || !photoFile) {
      console.log('[RoomRedesignForm] Validation failed: Missing photo, style, or file. Toasting and returning.');
      toast({
        variant: "destructive",
        title: "Información faltante",
        description: "Por favor, sube una foto y selecciona un estilo.",
      });
      return;
    }
    
    if (isSubmitDisabled || isLoading) { 
      console.log('[RoomRedesignForm] Submission blocked by isSubmitDisabled or isLoading prop. Toasting and returning.');
       toast({
        variant: "destructive",
        title: "Acción no permitida",
        description: "No puedes rediseñar ahora mismo. Revisa tu límite diario o espera a que termine la carga actual.",
      });
      return;
    }
    
    console.log('[RoomRedesignForm] All checks passed. Calling onSubmit prop.');
    await onSubmit(photoPreview, selectedStyle);
    console.log('[RoomRedesignForm] onSubmit prop finished.');
  };

  let buttonText = 'Generar Rediseño';
  const finalButtonDisabled = isSubmitDisabled || isLoading || !photoPreview || !photoFile || !selectedStyle;

  if (isLoading) {
    buttonText = 'Generando...';
  } else if (isSubmitDisabled && !isLoading && (!photoPreview || !photoFile || !selectedStyle) ) { 
    buttonText = 'Completa los Pasos';
  } else if (isSubmitDisabled && !isLoading) {
     buttonText = 'Límite Diario Alcanzado';
  }


  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-sm font-semibold mb-1 text-primary flex items-center
                       sm:text-base sm:mb-1.5">
            <UploadCloud className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
            1. Sube tu Foto
        </h2>
        <Input
          id="room-photo"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="file:mr-1.5 file:py-1 file:px-1.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors h-9 text-[11px] cursor-pointer focus-visible:ring-primary
                     sm:file:mr-2 sm:file:py-1.5 sm:file:px-2 sm:file:rounded-md sm:file:text-xs sm:h-10 sm:text-xs"
          aria-label="Subir foto de la habitación"
          disabled={isLoading}
        />
        {photoPreview && (
          <div className="mt-1.5 sm:mt-2 p-1 border border-border rounded-md bg-background/50">
            <p className="text-[10px] font-medium mb-0.5 text-center text-muted-foreground sm:text-xs sm:mb-1">Vista previa:</p>
            <Image
              src={photoPreview}
              alt="Vista previa de la habitación"
              width={240} 
              height={180}
              className="rounded-sm object-contain mx-auto max-h-[80px] w-auto 
                         sm:max-h-[100px] md:max-h-[120px]"
              data-ai-hint="room preview"
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-1 text-primary flex items-center
                       sm:text-base sm:mb-1.5">
            <Palette className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
            2. Elige un Estilo
        </h2>
        <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading || !photoPreview}>
          <SelectTrigger 
            id="design-style" 
            aria-label="Seleccionar estilo de diseño" 
            disabled={isLoading || !photoPreview} 
            className="h-9 text-[11px] focus:ring-primary
                       sm:h-10 sm:text-xs"
          >
            <SelectValue placeholder="Selecciona un estilo..." />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            {DESIGN_STYLES.map((style) => (
              <SelectItem key={style} value={style} className="text-[11px] py-1 focus:bg-accent focus:text-accent-foreground
                                                              sm:text-xs sm:py-1.5">
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-1 sm:pt-2">
        <form onSubmit={handleSubmit}>
            <Button 
            type="submit" 
            className="w-full text-xs py-2 
                       sm:text-sm sm:py-2.5" 
            disabled={finalButtonDisabled}
            size="default" 
            >
            {buttonText}
            {isLoading && <Wand2 className="ml-1.5 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4 animate-pulse" />}
            {!isLoading && !finalButtonDisabled && <Wand2 className="ml-1.5 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />}
            </Button>
        </form>
      </div>
    </div>
  );
}

    