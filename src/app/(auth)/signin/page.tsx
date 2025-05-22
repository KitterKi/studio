
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';


export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('1234'); // Pre-fill for easier prototype testing
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
       toast({ variant: "destructive", title: "Missing fields", description: "Please enter email and password." });
      return;
    }
    try {
      await login(email, password);
      // On successful login, AuthContext will redirect to '/'
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message || "An unexpected error occurred." });
    }
  };

  return (
    <>
      <Link href="/" className="flex items-center gap-2 mb-8" aria-label={`${APP_NAME} home page`}>
        {/* Simplified: Re-add LogoIcon if this page works */}
        <span className="font-semibold text-2xl text-foreground">{APP_NAME}</span>
      </Link>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <LogIn className="h-7 w-7" /> Sign In
          </CardTitle>
          <CardDescription>Access your {APP_NAME} account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
