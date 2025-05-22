
'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Label is not explicitly used, but good to keep if needed
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
    
    // isSubmitDisabled already covers isLoading and daily limit, but explicit check is fine
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
  // The main isSubmitDisabled prop is determined by parent based on user login, daily limits, etc.
  // We also add isLoading, !photoPreview, etc., for local form validation.
  const finalButtonDisabled = isSubmitDisabled || isLoading || !photoPreview || !photoFile || !selectedStyle;

  if (isLoading) {
    buttonText = 'Generando...';
  } else if (isSubmitDisabled && !isLoading) { // If disabled due to parent logic (e.g. limit)
    buttonText = 'Límite Diario Alcanzado';
  }


  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-primary flex items-center">
            <UploadCloud className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            1. Sube tu Foto
        </h2>
        <Input
          id="room-photo"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors h-11 sm:h-12 text-sm sm:text-base cursor-pointer focus-visible:ring-primary"
          aria-label="Subir foto de la habitación"
          disabled={isLoading}
        />
        {photoPreview && (
          <div className="mt-3 sm:mt-4 p-1.5 sm:p-2 border border-border rounded-lg bg-background/50">
            <p className="text-xs font-medium mb-1.5 sm:mb-2 text-center text-muted-foreground">Vista previa:</p>
            <Image
              src={photoPreview}
              alt="Vista previa de la habitación"
              width={400}
              height={300}
              className="rounded-md object-contain mx-auto max-h-[120px] sm:max-h-[150px] md:max-h-[180px] w-auto"
              data-ai-hint="room preview"
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-primary flex items-center">
            <Palette className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            2. Elige un Estilo
        </h2>
        <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading || !photoPreview}>
          <SelectTrigger 
            id="design-style" 
            aria-label="Seleccionar estilo de diseño" 
            disabled={isLoading || !photoPreview} 
            className="h-11 sm:h-12 text-sm sm:text-base focus:ring-primary"
          >
            <SelectValue placeholder="Selecciona un estilo..." />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            {DESIGN_STYLES.map((style) => (
              <SelectItem key={style} value={style} className="text-sm sm:text-base py-2 sm:py-2.5 focus:bg-accent focus:text-accent-foreground">
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-2 sm:pt-4">
        <form onSubmit={handleSubmit}>
            <Button 
            type="submit" 
            className="w-full text-base sm:text-lg py-5 sm:py-6" 
            disabled={finalButtonDisabled}
            size="lg"
            >
            {buttonText}
            {isLoading && <Wand2 className="ml-2 h-5 w-5 animate-pulse" />}
            {!isLoading && !finalButtonDisabled && <Wand2 className="ml-2 h-5 w-5" />}
            </Button>
        </form>
      </div>
    </div>
  );
}
