
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
  isSubmitDisabled?: boolean; // New prop to control submission button
}

export default function RoomRedesignForm({ onSubmit, isLoading, isSubmitDisabled }: RoomRedesignFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit file size (e.g., 4MB)
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
        });
        setPhotoPreview(null);
        setPhotoFile(null);
        event.target.value = ''; // Reset file input
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
        title: "Missing information",
        description: "Please upload a photo and select a style.",
      });
      return;
    }
    if (isSubmitDisabled) { // Check this explicit prop
       toast({
        variant: "destructive",
        title: "Cannot Redesign",
        description: "You may have reached your daily limit or another restriction applies.",
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
          Create Your Dream Room
        </CardTitle>
        <CardDescription>Upload a photo of your room and choose a style to see the magic happen!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room-photo" className="flex items-center gap-2 text-base font-semibold">
              <UploadCloud className="h-5 w-5" />
              Upload Room Photo
            </Label>
            <Input
              id="room-photo"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              aria-label="Upload room photo"
              disabled={isLoading}
            />
            {photoPreview && (
              <div className="mt-4 p-2 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2 text-center">Your Uploaded Photo:</p>
                <Image
                  src={photoPreview}
                  alt="Room preview"
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
              Choose Design Style
            </Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading}>
              <SelectTrigger id="design-style" aria-label="Select design style">
                <SelectValue placeholder="Select a style..." />
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
            {isLoading ? 'Redesigning...' : (isSubmitDisabled && !isLoading ? 'Limit Reached' : 'Redesign My Room')}
            {!isLoading && !(isSubmitDisabled && !isLoading) && <Wand2 className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
