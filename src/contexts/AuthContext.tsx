
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
  originalImage: string; // This will be an empty string in localStorage for favorites
  redesignedImage: string;
  title: string;
  style: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name?:string) => Promise<void>;
  logout: () => void;
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'createdAt'>) => void;
  removeFavorite: (id: string) => void;
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
        // Load redesign counts for this user
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
        setFavorites(JSON.parse(storedFavorites).map((fav: FavoriteItem) => ({
          ...fav,
          originalImage: fav.originalImage || '', // Ensure originalImage is at least an empty string
          createdAt: new Date(fav.createdAt)
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

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'createdAt'>) => {
    setFavorites(prevFavorites => {
      const newFavorite: FavoriteItem = {
        originalImage: '', // Don't store full original image data URI
        redesignedImage: item.redesignedImage,
        title: item.title,
        style: item.style,
        id: `fav-${Date.now()}`,
        createdAt: new Date(),
      };
      const updatedFavorites = [newFavorite, ...prevFavorites];
      try {
        localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
      } catch (e) {
        console.error("Error guardando favoritos en localStorage (posiblemente cuota excedida aún):", e);
        // Potentially notify user or implement a more robust queue/trimming strategy here
        // For now, we'll just log the error. If this still happens, redesignedImage is too big.
        if (updatedFavorites.length > 1) { // Attempt to save without the newest if it failed
            const trimmedFavorites = updatedFavorites.slice(1);
             try {
                localStorage.setItem('userFavorites', JSON.stringify(trimmedFavorites));
                // TODO: Consider notifying user that the save failed due to space
                return trimmedFavorites; // Return the state without the problematic item
             } catch (e2) {
                console.error("Error guardando favoritos recortados:", e2);
             }
        }
        return prevFavorites; // Return previous state if all fails
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
      canUserRedesign,
      recordRedesignAttempt,
      remainingRedesignsToday
    }}>
      {children}
    </AuthContext.Provider>
  );
};
