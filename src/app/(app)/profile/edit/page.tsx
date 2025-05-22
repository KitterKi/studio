
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProfilePage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <Link href="/profile" passHref legacyBehavior>
            <a className="inline-block hover:text-primary transition-colors">
              <CardTitle className="text-2xl flex items-center gap-2 cursor-pointer">
                <ArrowLeft className="h-6 w-6" />
                Editar Perfil
              </CardTitle>
            </a>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Esta sección está en construcción. Aquí podrás editar los detalles de tu perfil.
          </p>
          <Link href="/profile" passHref legacyBehavior>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Perfil
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
