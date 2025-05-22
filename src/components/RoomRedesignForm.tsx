
'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DESIGN_STYLES } from '@/lib/constants';
import { UploadCloud, Palette, Wand2, Info } from 'lucide-react';
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
    if (!photoPreview || !selectedStyle || !photoFile) {
      toast({
        variant: "destructive",
        title: "Información faltante",
        description: "Por favor, sube una foto y selecciona un estilo.",
      });
      return;
    }
    if (isSubmitDisabled) { 
       toast({
        variant: "destructive",
        title: "Límite Diario Alcanzado",
        description: "Has usado todos tus rediseños hoy. Vuelve mañana.",
      });
      return;
    }
    
    await onSubmit(photoPreview, selectedStyle);
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
            <UploadCloud className="mr-2 h-5 w-5 text-primary" />
            1. Sube tu Foto
        </h2>
        <Input
          id="room-photo"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors h-12 text-base"
          aria-label="Subir foto de la habitación"
          disabled={isLoading}
        />
        {photoPreview && (
          <div className="mt-4 p-2 border rounded-lg bg-muted/50">
            <p className="text-xs font-medium mb-1 text-center text-muted-foreground">Vista previa:</p>
            <Image
              src={photoPreview}
              alt="Vista previa de la habitación"
              width={400}
              height={300}
              className="rounded-md object-contain mx-auto max-h-[150px] sm:max-h-[200px] w-auto"
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
            <Palette className="mr-2 h-5 w-5 text-primary" />
            2. Elige un Estilo
        </h2>
        <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading || !photoPreview}>
          <SelectTrigger id="design-style" aria-label="Seleccionar estilo de diseño" disabled={isLoading || !photoPreview} className="h-12 text-base">
            <SelectValue placeholder="Selecciona un estilo..." />
          </SelectTrigger>
          <SelectContent>
            {DESIGN_STYLES.map((style) => (
              <SelectItem key={style} value={style} className="text-base py-2">
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !photoPreview || !selectedStyle || isSubmitDisabled}
          size="lg"
        >
          {isLoading ? 'Generando...' : (isSubmitDisabled && !isLoading ? 'Límite Diario Alcanzado' : 'Generar Rediseño')}
          {!isLoading && !(isSubmitDisabled && !isLoading) && <Wand2 className="ml-2 h-4 w-4" />}
          {isLoading && <Wand2 className="ml-2 h-4 w-4 animate-pulse" />}
        </Button>
      </div>
    </div>
  );
}
