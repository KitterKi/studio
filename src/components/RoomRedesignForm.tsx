
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
    
    if (isSubmitDisabled) { 
      console.log('[RoomRedesignForm] Submission blocked by isSubmitDisabled prop (e.g., daily limit). Toasting and returning.');
       toast({
        variant: "destructive",
        title: "Acción no permitida",
        description: "Has alcanzado tu límite diario de rediseños o la acción no está permitida actualmente.",
      });
      return;
    }
    
    console.log('[RoomRedesignForm] All checks passed. Calling onSubmit prop.');
    await onSubmit(photoPreview, selectedStyle);
    console.log('[RoomRedesignForm] onSubmit prop finished.');
  };

  let buttonText = 'Generar Rediseño';
  let finalButtonDisabled = isLoading || !photoPreview || !photoFile || !selectedStyle;

  if (isLoading) {
    buttonText = 'Generando...';
  } else if (isSubmitDisabled) { 
    buttonText = 'Límite Diario Alcanzado';
    finalButtonDisabled = true;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-3 text-primary flex items-center">
            <UploadCloud className="mr-3 h-6 w-6" />
            1. Sube tu Foto
        </h2>
        <Input
          id="room-photo"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors h-12 text-base cursor-pointer focus-visible:ring-primary"
          aria-label="Subir foto de la habitación"
          disabled={isLoading}
        />
        {photoPreview && (
          <div className="mt-4 p-2 border border-border rounded-lg bg-background/50">
            <p className="text-xs font-medium mb-2 text-center text-muted-foreground">Vista previa:</p>
            <Image
              src={photoPreview}
              alt="Vista previa de la habitación"
              width={400}
              height={300}
              className="rounded-md object-contain mx-auto max-h-[150px] sm:max-h-[200px] w-auto"
              data-ai-hint="room preview"
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3 text-primary flex items-center">
            <Palette className="mr-3 h-6 w-6" />
            2. Elige un Estilo
        </h2>
        <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading || !photoPreview}>
          <SelectTrigger 
            id="design-style" 
            aria-label="Seleccionar estilo de diseño" 
            disabled={isLoading || !photoPreview} 
            className="h-12 text-base focus:ring-primary"
          >
            <SelectValue placeholder="Selecciona un estilo..." />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            {DESIGN_STYLES.map((style) => (
              <SelectItem key={style} value={style} className="text-base py-2.5 focus:bg-accent focus:text-accent-foreground">
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-4">
        <form onSubmit={handleSubmit}>
            <Button 
            type="submit" 
            className="w-full text-lg py-6" 
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
