
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Simplified User interface for mock auth
export interface User {
  id: string;
  name?: string; // Optional name
  email: string;
}

export interface FavoriteItem {
  id: string;
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
  login: (email: string, pass: string) => Promise<void>; // Mock login
  signup: (name: string, email: string, pass: string) => Promise<void>; // Mock signup
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
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [dailyRedesignCount, setDailyRedesignCount] = useState(0);
  const [lastRedesignTrackDate, setLastRedesignTrackDate] = useState<string | null>(null);
  const [followedUsernames, setFollowedUsernames] = useState<string[]>([]);

  useEffect(() => {
    // Simulate checking auth status
    setIsLoading(true);
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      loadUserData(parsedUser.id); // Use a generic ID or email for mock user data
    } else {
      setUser(null);
      clearUserData();
    }
    setIsLoading(false);
  }, []);

  const loadUserData = (userId: string) => { // userId is now more generic for mock
    const today = getTodayDateString();
    const storedCount = localStorage.getItem(`redesignCount_${userId}`);
    const storedDate = localStorage.getItem(`lastRedesignDate_${userId}`);

    if (storedDate === today && storedCount) {
      setDailyRedesignCount(parseInt(storedCount, 10));
      setLastRedesignTrackDate(today);
    } else {
      setDailyRedesignCount(0);
      setLastRedesignTrackDate(today);
      localStorage.setItem(`redesignCount_${userId}`, '0');
      localStorage.setItem(`lastRedesignDate_${userId}`, today);
    }

    const storedFavorites = localStorage.getItem(`userFavorites_${userId}`);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites).map((fav: any) => ({
        ...fav,
        createdAt: new Date(fav.createdAt),
      })));
    } else {
      setFavorites([]);
    }

    const storedFollowedUsernames = localStorage.getItem(`followedUsernames_${userId}`);
    if (storedFollowedUsernames) {
      setFollowedUsernames(JSON.parse(storedFollowedUsernames));
    } else {
      setFollowedUsernames([]);
    }
  };

  const clearUserData = () => {
    setFavorites([]);
    setFollowedUsernames([]);
    setDailyRedesignCount(0);
    setLastRedesignTrackDate(null);
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Mock login: any email/pass works, "1234" for the specific password
    if (pass === "1234" && email) {
      const mockUser: User = { id: email, email, name: email.split('@')[0] }; // Use email as ID for mock
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      loadUserData(mockUser.id);
      toast({ title: "¡Bienvenido de Nuevo!", description: "Has iniciado sesión (simulado)." });
      if (pathname.startsWith('/auth')) {
        router.push('/');
      }
    } else {
      toast({ variant: "destructive", title: "Error de Inicio de Sesión", description: "Email o contraseña incorrectos (simulado)." });
    }
    setIsLoading(false);
  };
  
  const signup = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    // Mock signup: any email/pass works
    if (email && pass && name) {
        const mockUser: User = { id: email, email, name }; // Use email as ID
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        loadUserData(mockUser.id);
        toast({ title: "¡Cuenta Creada!", description: "Has sido registrado (simulado)." });
        if (pathname.startsWith('/auth')) {
            router.push('/');
        }
    } else {
        toast({ variant: "destructive", title: "Error de Registro", description: "Por favor completa todos los campos (simulado)." });
    }
    setIsLoading(false);
  };


  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem('mockUser');
    const userId = user?.id; // Get user ID before clearing user
    if (userId) {
        // Optional: Clear user-specific data on logout, or keep it if you want it to persist for next login
        // localStorage.removeItem(`redesignCount_${userId}`);
        // localStorage.removeItem(`lastRedesignDate_${userId}`);
        // localStorage.removeItem(`userFavorites_${userId}`);
        // localStorage.removeItem(`followedUsernames_${userId}`);
    }
    setUser(null);
    clearUserData();
    toast({ title: "Sesión Cerrada", description: "Has cerrado sesión correctamente (simulado)." });
    router.push('/auth/signin');
    setIsLoading(false);
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
        
        if (!plainStyleExists && styleFavorites.length === 0) { // First item, no number
             newTitle = style;
        } else if (plainStyleExists && maxNum === 0 && styleFavorites.length === 1) { // "Style" exists, next is "Style 2"
            newTitle = `${style} 2`;
        } else if (maxNum > 0) {
            newTitle = `${style} ${maxNum + 1}`;
        } else if (!plainStyleExists && maxNum === 0 && styleFavorites.length > 0) { // Only "Style X" exists, no plain "Style"
            newTitle = `${style} ${styleFavorites.length + 1}`;
        } else { // fallback, or first numbered if plain exists
            newTitle = `${style} ${styleFavorites.length + 1}`;
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
        localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(updatedFavorites));
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
      localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [user]);

  const updateFavoriteTitle = useCallback((id: string, newTitle: string) => {
    if (!user) return;
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.map(fav =>
        fav.id === id ? { ...fav, title: newTitle } : fav
      );
      localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(updatedFavorites));
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
      localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [user]);

  const canUserRedesign = useCallback(() => {
    if (!user) return false;
    const today = getTodayDateString();
    if (lastRedesignTrackDate !== today) {
      setDailyRedesignCount(0); // Reset count for new day
      setLastRedesignTrackDate(today);
      localStorage.setItem(`redesignCount_${user.id}`, '0');
      localStorage.setItem(`lastRedesignDate_${user.id}`, today);
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
      localStorage.setItem(`followedUsernames_${user.id}`, JSON.stringify(newFollowed));
      return newFollowed;
    });
  }, [user]);

  const followingCount = useMemo(() => followedUsernames.length, [followedUsernames]);


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
