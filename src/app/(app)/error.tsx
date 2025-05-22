'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center flex-grow py-12">
      <Card className="w-full max-w-lg text-center shadow-2xl bg-card">
        <CardHeader className="pb-4">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold text-destructive">
            Oops! Something Went Wrong
          </CardTitle>
          <CardDescription className="text-lg text-card-foreground/80">
            We're sorry, but an unexpected error occurred.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error?.message && (
            <p className="text-sm bg-destructive/10 p-3 rounded-md text-destructive border border-destructive/20">
              <strong>Error details:</strong> {error.message}
            </p>
          )}
           <p className="mt-4 text-sm text-card-foreground/70">
            You can try to refresh the page or click the button below.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button onClick={() => reset()} variant="destructive" size="lg">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
            Go to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
