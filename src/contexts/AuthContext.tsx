
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface FavoriteItem {
  id: string;
  originalImage: string; 
  redesignedImage: string;
  title: string;
  style: string;
  createdAt: Date;
  likes: number; 
  comments: number; 
  userHasLiked: boolean; // Nuevo campo para el "Me gusta" del usuario actual
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name?:string) => Promise<void>;
  logout: () => void;
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'userHasLiked'>) => void;
  removeFavorite: (id: string) => void;
  toggleUserLike: (favoriteId: string) => void; // Nueva función
  canUserRedesign: () => boolean;
  recordRedesignAttempt: () => void;
  remainingRedesignsToday: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_REDESIGNS_PER_DAY = 5;
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const router = useRouter();

  const [dailyRedesignCount, setDailyRedesignCount] = useState(0);
  const [lastRedesignTrackDate, setLastRedesignTrackDate] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const today = getTodayDateString();
        const storedCount = localStorage.getItem(`redesignCount_${parsedUser.id}`);
        const storedDate = localStorage.getItem(`lastRedesignDate_${parsedUser.id}`);

        if (storedDate === today && storedCount) {
          setDailyRedesignCount(parseInt(storedCount, 10));
          setLastRedesignTrackDate(today);
        } else {
          setDailyRedesignCount(0);
          setLastRedesignTrackDate(today);
          localStorage.setItem(`redesignCount_${parsedUser.id}`, '0');
          localStorage.setItem(`lastRedesignDate_${parsedUser.id}`, today);
        }
      }
      const storedFavorites = localStorage.getItem('userFavorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites).map((fav: any) => ({
          ...fav,
          originalImage: fav.originalImage || '', 
          createdAt: new Date(fav.createdAt),
          likes: fav.likes || Math.floor(Math.random() * 150) + 5,
          comments: fav.comments || Math.floor(Math.random() * 30) + 2,
          userHasLiked: fav.userHasLiked || false, // Asegurar que el campo existe
        })));
      }
    } catch (error) {
      console.error("Error cargando desde localStorage", error);
      localStorage.removeItem('authUser');
      localStorage.removeItem('userFavorites');
      if (user) {
        localStorage.removeItem(`redesignCount_${user.id}`);
        localStorage.removeItem(`lastRedesignDate_${user.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (user) {
      const today = getTodayDateString();
      const storedCount = localStorage.getItem(`redesignCount_${user.id}`);
      const storedDate = localStorage.getItem(`lastRedesignDate_${user.id}`);

      if (storedDate === today && storedCount) {
        setDailyRedesignCount(parseInt(storedCount, 10));
        setLastRedesignTrackDate(today);
      } else {
        setDailyRedesignCount(0);
        setLastRedesignTrackDate(today);
        localStorage.setItem(`redesignCount_${user.id}`, '0');
        localStorage.setItem(`lastRedesignDate_${user.id}`, today);
      }
    } else {
      setDailyRedesignCount(0);
      setLastRedesignTrackDate(null);
    }
  }, [user]);


  const login = useCallback(async (email: string, _pass: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: 'mock-user-id-' + email, email, name: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    
    const today = getTodayDateString();
    setDailyRedesignCount(0);
    setLastRedesignTrackDate(today);
    localStorage.setItem(`redesignCount_${mockUser.id}`, '0');
    localStorage.setItem(`lastRedesignDate_${mockUser.id}`, today);

    const storedFavorites = localStorage.getItem('userFavorites');
      if (storedFavorites) {
         setFavorites(JSON.parse(storedFavorites).map((fav: any) => ({
          ...fav,
          originalImage: fav.originalImage || '',
          createdAt: new Date(fav.createdAt),
          likes: fav.likes || Math.floor(Math.random() * 150) + 5,
          comments: fav.comments || Math.floor(Math.random() * 30) + 2,
          userHasLiked: fav.userHasLiked || false,
        })));
      } else {
        setFavorites([]);
      }

    setIsLoading(false);
    router.push('/');
  }, [router]);

  const signup = useCallback(async (email: string, _pass: string, name?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: 'mock-user-id-' + email, email, name: name || email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setFavorites([]); 
    localStorage.setItem('userFavorites', JSON.stringify([]));

    const today = getTodayDateString();
    setDailyRedesignCount(0);
    setLastRedesignTrackDate(today);
    localStorage.setItem(`redesignCount_${mockUser.id}`, '0');
    localStorage.setItem(`lastRedesignDate_${mockUser.id}`, today);

    setIsLoading(false);
    router.push('/');
  }, [router]);

  const logout = useCallback(() => {
    if (user) { 
      localStorage.removeItem(`redesignCount_${user.id}`);
      localStorage.removeItem(`lastRedesignDate_${user.id}`);
    }
    setUser(null);
    localStorage.removeItem('authUser');
    router.push('/auth/signin');
  }, [user, router]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'userHasLiked'>) => {
    setFavorites(prevFavorites => {
      const newFavorite: FavoriteItem = {
        ...item,
        originalImage: '', // Reducir el tamaño en localStorage
        id: `fav-${Date.now()}`,
        createdAt: new Date(),
        likes: Math.floor(Math.random() * 200) + 10, 
        comments: Math.floor(Math.random() * 50) + 5, 
        userHasLiked: false, // Por defecto, el usuario no le ha dado "Me gusta"
      };
      const updatedFavorites = [newFavorite, ...prevFavorites];
      try {
        localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
      } catch (e) {
        console.error("Error guardando favoritos en localStorage:", e);
        if (updatedFavorites.length > 1) { 
            const trimmedFavorites = updatedFavorites.slice(0, -1); // Quitar el último (el recién añadido)
             try {
                localStorage.setItem('userFavorites', JSON.stringify(trimmedFavorites));
                return trimmedFavorites; 
             } catch (e2) {
                console.error("Error guardando favoritos recortados:", e2);
             }
        }
        return prevFavorites; 
      }
      return updatedFavorites;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.filter(fav => fav.id !== id);
      localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const toggleUserLike = useCallback((favoriteId: string) => {
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
      localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const canUserRedesign = useCallback(() => {
    if (!user) return false;
    const today = getTodayDateString();
    if (lastRedesignTrackDate !== today) {
      return true; 
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
      localStorage.setItem(`lastRedesignDate_${user.id}`, today);
    } else {
      newCount = dailyRedesignCount + 1;
    }
    
    setDailyRedesignCount(newCount);
    localStorage.setItem(`redesignCount_${user.id}`, newCount.toString());

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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      favorites, 
      addFavorite, 
      removeFavorite,
      toggleUserLike,
      canUserRedesign,
      recordRedesignAttempt,
      remainingRedesignsToday
    }}>
      {children}
    </AuthContext.Provider>
  );
};
