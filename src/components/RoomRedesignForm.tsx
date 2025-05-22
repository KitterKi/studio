
'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
        title: "No se Puede Rediseñar",
        description: "Puede que hayas alcanzado tu límite diario u otra restricción aplica.",
      });
      return;
    }
    
    await onSubmit(photoPreview, selectedStyle);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="h-6 w-6 text-primary" />
          Crea la Habitación de tus Sueños
        </CardTitle>
        <CardDescription>¡Sube una foto de tu habitación y elige un estilo para ver la magia suceder!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room-photo" className="flex items-center gap-2 text-base font-semibold">
              <UploadCloud className="h-5 w-5" />
              Subir Foto de la Habitación
            </Label>
            <Input
              id="room-photo"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              aria-label="Subir foto de la habitación"
              disabled={isLoading}
            />
            {photoPreview && (
              <div className="mt-4 p-2 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2 text-center">Tu Foto Subida:</p>
                <Image
                  src={photoPreview}
                  alt="Vista previa de la habitación"
                  width={400}
                  height={300}
                  className="rounded-md object-contain mx-auto max-h-[300px] w-auto"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="design-style" className="flex items-center gap-2 text-base font-semibold">
              <Palette className="h-5 w-5" />
              Elegir Estilo de Diseño
            </Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading}>
              <SelectTrigger id="design-style" aria-label="Seleccionar estilo de diseño">
                <SelectValue placeholder="Selecciona un estilo..." />
              </SelectTrigger>
              <SelectContent>
                {DESIGN_STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !photoPreview || !selectedStyle || isSubmitDisabled}
          >
            {isLoading ? 'Rediseñando...' : (isSubmitDisabled && !isLoading ? 'Límite Alcanzado' : 'Rediseñar Mi Habitación')}
            {!isLoading && !(isSubmitDisabled && !isLoading) && <Wand2 className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
