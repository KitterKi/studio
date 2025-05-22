
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-md sm:text-lg font-semibold mb-1.5 sm:mb-2 text-primary flex items-center">
            <UploadCloud className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            1. Sube tu Foto
        </h2>
        <Input
          id="room-photo"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="file:mr-2 file:py-1.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors h-10 text-xs sm:text-sm cursor-pointer focus-visible:ring-primary"
          aria-label="Subir foto de la habitación"
          disabled={isLoading}
        />
        {photoPreview && (
          <div className="mt-2 sm:mt-3 p-1.5 border border-border rounded-lg bg-background/50">
            <p className="text-xs font-medium mb-1 sm:mb-1.5 text-center text-muted-foreground">Vista previa:</p>
            <Image
              src={photoPreview}
              alt="Vista previa de la habitación"
              width={300} 
              height={225}
              className="rounded-md object-contain mx-auto max-h-[100px] sm:max-h-[120px] md:max-h-[150px] w-auto"
              data-ai-hint="room preview"
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-md sm:text-lg font-semibold mb-1.5 sm:mb-2 text-primary flex items-center">
            <Palette className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            2. Elige un Estilo
        </h2>
        <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading || !photoPreview}>
          <SelectTrigger 
            id="design-style" 
            aria-label="Seleccionar estilo de diseño" 
            disabled={isLoading || !photoPreview} 
            className="h-10 text-xs sm:text-sm focus:ring-primary"
          >
            <SelectValue placeholder="Selecciona un estilo..." />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            {DESIGN_STYLES.map((style) => (
              <SelectItem key={style} value={style} className="text-xs sm:text-sm py-1.5 sm:py-2 focus:bg-accent focus:text-accent-foreground">
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
            className="w-full text-sm sm:text-base py-2.5 sm:py-3" 
            disabled={finalButtonDisabled}
            size="lg" // Size lg gives h-11 by default, we are overriding with py
            >
            {buttonText}
            {isLoading && <Wand2 className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />}
            {!isLoading && !finalButtonDisabled && <Wand2 className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
        </form>
      </div>
    </div>
  );
}
