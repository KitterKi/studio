
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Import auth from your Firebase config
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  type User as FirebaseUser // Rename to avoid conflict
} from "firebase/auth";
import { useToast } from '@/hooks/use-toast';

export interface User { // This will now store Firebase User info
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null; // Optional: if you want to use Google profile picture
}

export interface FavoriteItem {
  id: string;
  // originalImage: string; // No longer saving original image
  redesignedImage: string;
  title: string;
  style: string;
  createdAt: Date;
  likes: number;
  comments: number;
  userHasLiked: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'userHasLiked' | 'title'>) => void;
  removeFavorite: (id: string) => void;
  updateFavoriteTitle: (id: string, newTitle: string) => void;
  toggleUserLike: (favoriteId: string) => void;
  canUserRedesign: () => boolean;
  recordRedesignAttempt: () => void;
  remainingRedesignsToday: number;
  followedUsernames: string[];
  isFollowing: (username: string) => boolean;
  toggleFollow: (username: string) => void;
  followingCount: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_REDESIGNS_PER_DAY = 5;
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [dailyRedesignCount, setDailyRedesignCount] = useState(0);
  const [lastRedesignTrackDate, setLastRedesignTrackDate] = useState<string | null>(null);
  const [followedUsernames, setFollowedUsernames] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true); // Set loading true while processing auth state
      if (firebaseUser) {
        const appUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(appUser);
        
        // Load user-specific data from localStorage
        const today = getTodayDateString();
        const storedCount = localStorage.getItem(`redesignCount_${appUser.uid}`);
        const storedDate = localStorage.getItem(`lastRedesignDate_${appUser.uid}`);

        if (storedDate === today && storedCount) {
          setDailyRedesignCount(parseInt(storedCount, 10));
          setLastRedesignTrackDate(today);
        } else {
          setDailyRedesignCount(0);
          setLastRedesignTrackDate(today);
          localStorage.setItem(`redesignCount_${appUser.uid}`, '0');
          localStorage.setItem(`lastRedesignDate_${appUser.uid}`, today);
        }

        const storedFavorites = localStorage.getItem(`userFavorites_${appUser.uid}`);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites).map((fav: any) => ({
            ...fav,
            createdAt: new Date(fav.createdAt),
          })));
        } else {
          setFavorites([]);
        }

        const storedFollowedUsernames = localStorage.getItem(`followedUsernames_${appUser.uid}`);
        if (storedFollowedUsernames) {
          setFollowedUsernames(JSON.parse(storedFollowedUsernames));
        } else {
          setFollowedUsernames([]);
        }

      } else {
        setUser(null);
        setFavorites([]);
        setFollowedUsernames([]);
        setDailyRedesignCount(0);
        setLastRedesignTrackDate(null);
      }
      setIsLoading(false); // Set loading false after processing
    });

    return () => unsubscribe();
  }, []);


  const signInWithGoogle = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting user and redirecting
      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión con Google."});
      // Redirect after successful sign-in if on auth pages
      if (pathname.startsWith('/auth')) {
        router.push('/');
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error);
      toast({ variant: "destructive", title: "Error de Inicio de Sesión", description: error.message || "No se pudo iniciar sesión con Google." });
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will set user to null
      toast({ title: "Sesión Cerrada", description: "Has cerrado sesión correctamente."});
      router.push('/auth/signin'); // Redirect to sign-in after logout
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      toast({ variant: "destructive", title: "Error al Cerrar Sesión", description: error.message });
      setIsLoading(false);
    }
  };

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'userHasLiked' | 'title'>) => {
    if (!user) return;
    setFavorites(prevFavorites => {
      const style = item.style;
      let newTitle = style;
      const styleFavorites = prevFavorites.filter(fav => fav.title.startsWith(style));
      
      if (styleFavorites.length > 0) {
        let maxNum = 0;
        let plainStyleExists = false;
        styleFavorites.forEach(fav => {
          if (fav.title === style) plainStyleExists = true;
          const match = fav.title.match(new RegExp(`^${style}\\s*(\\d+)$`));
          if (match) {
            maxNum = Math.max(maxNum, parseInt(match[1]));
          }
        });
        if (plainStyleExists) {
          newTitle = `${style} ${maxNum + 1 > 1 ? maxNum + 1 : 2}`;
        } else {
          newTitle = `${style} ${maxNum + 1}`;
        }
        if (maxNum === 0 && !plainStyleExists && styleFavorites.length > 0) { // Only "Style X" exists, no plain "Style"
            newTitle = `${style} ${styleFavorites.length + 1}`;
        } else if (maxNum === 0 && plainStyleExists ) { // Only plain "Style" exists
             newTitle = `${style} 2`;
        } else if (maxNum > 0 ) {
             newTitle = `${style} ${maxNum + 1}`;
        }

      } else {
        newTitle = style; // First item of this style
      }
      
      const newFavorite: FavoriteItem = {
        ...item,
        title: newTitle,
        id: `fav-${Date.now()}`,
        createdAt: new Date(),
        likes: Math.floor(Math.random() * 200) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
        userHasLiked: false,
      };
      const updatedFavorites = [newFavorite, ...prevFavorites];
      try {
        localStorage.setItem(`userFavorites_${user.uid}`, JSON.stringify(updatedFavorites));
      } catch (e) {
        console.error("Error guardando favoritos en localStorage:", e);
      }
      return updatedFavorites;
    });
  }, [user]);

  const removeFavorite = useCallback((id: string) => {
    if (!user) return;
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.filter(fav => fav.id !== id);
      localStorage.setItem(`userFavorites_${user.uid}`, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [user]);

  const updateFavoriteTitle = useCallback((id: string, newTitle: string) => {
    if (!user) return;
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.map(fav =>
        fav.id === id ? { ...fav, title: newTitle } : fav
      );
      localStorage.setItem(`userFavorites_${user.uid}`, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [user]);

  const toggleUserLike = useCallback((favoriteId: string) => {
    if (!user) return;
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.map(fav => {
        if (fav.id === favoriteId) {
          const newLikedState = !fav.userHasLiked;
          return {
            ...fav,
            userHasLiked: newLikedState,
            likes: newLikedState ? fav.likes + 1 : fav.likes - 1,
          };
        }
        return fav;
      });
      localStorage.setItem(`userFavorites_${user.uid}`, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [user]);

  const canUserRedesign = useCallback(() => {
    if (!user) return false;
    const today = getTodayDateString();
    if (lastRedesignTrackDate !== today) {
      // Reset count for new day for the current user
      // This logic is now inside onAuthStateChanged for initial load and login
      return true; // Can redesign if date mismatch (implies new day or first time)
    }
    return dailyRedesignCount < MAX_REDESIGNS_PER_DAY;
  }, [user, dailyRedesignCount, lastRedesignTrackDate]);

  const recordRedesignAttempt = useCallback(() => {
    if (!user) return;
    const today = getTodayDateString();
    let newCount = dailyRedesignCount;

    if (lastRedesignTrackDate !== today) {
      newCount = 1;
      setLastRedesignTrackDate(today);
      localStorage.setItem(`lastRedesignDate_${user.uid}`, today);
    } else {
      newCount = dailyRedesignCount + 1;
    }

    setDailyRedesignCount(newCount);
    localStorage.setItem(`redesignCount_${user.uid}`, newCount.toString());

  }, [user, dailyRedesignCount, lastRedesignTrackDate]);

  const remainingRedesignsToday = useMemo(() => {
    if (!user) return 0;
    const today = getTodayDateString();
    if (lastRedesignTrackDate !== today) {
      return MAX_REDESIGNS_PER_DAY;
    }
    const remaining = MAX_REDESIGNS_PER_DAY - dailyRedesignCount;
    return remaining < 0 ? 0 : remaining;
  }, [user, dailyRedesignCount, lastRedesignTrackDate]);

  const isFollowing = useCallback((username: string) => {
    return followedUsernames.includes(username);
  }, [followedUsernames]);

  const toggleFollow = useCallback((username: string) => {
    if (!user) return;
    setFollowedUsernames(prev => {
      const isCurrentlyFollowing = prev.includes(username);
      let newFollowed: string[];
      if (isCurrentlyFollowing) {
        newFollowed = prev.filter(name => name !== username);
      } else {
        newFollowed = [...prev, username];
      }
      localStorage.setItem(`followedUsernames_${user.uid}`, JSON.stringify(newFollowed));
      return newFollowed;
    });
  }, [user]);

  const followingCount = useMemo(() => followedUsernames.length, [followedUsernames]);


  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signInWithGoogle,
      logout,
      favorites,
      addFavorite,
      removeFavorite,
      updateFavoriteTitle,
      toggleUserLike,
      canUserRedesign,
      recordRedesignAttempt,
      remainingRedesignsToday,
      followedUsernames,
      isFollowing,
      toggleFollow,
      followingCount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
