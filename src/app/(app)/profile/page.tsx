
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserCircle, Mail, Edit3 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading profile..." size={16} /></div>;
  }

  if (!user) {
     return (
       <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need to be logged in to view your profile.
             <Link href="/auth/signin" className="text-primary hover:underline ml-1">Sign In</Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    if (email) return email.substring(0,2).toUpperCase();
    return 'U';
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <UserCircle className="h-10 w-10 text-primary" /> My Profile
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">Manage your account details.</p>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
           <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/50 ring-offset-background ring-offset-2">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name, user.email)}`} alt={user.name || user.email} data-ai-hint="profile large"/>
            <AvatarFallback className="text-3xl">{getInitials(user.name, user.email)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.name || 'User'}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" /> Name
            </Label>
            <Input id="name" value={user.name || ''} readOnly disabled className="bg-muted/30"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email
            </Label>
            <Input id="email" type="email" value={user.email} readOnly disabled className="bg-muted/30"/>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="w-full" disabled>
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Coming Soon)
            </Button>
            <Button variant="destructive" onClick={logout} className="w-full">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
