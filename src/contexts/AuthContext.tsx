
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
    console.log('[AuthContext] Initializing auth state...');
    setIsLoading(true);
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      console.log('[AuthContext] Found stored user:', parsedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id); 
    } else {
      console.log('[AuthContext] No stored user found.');
      setUser(null);
      clearUserData();
    }
    setIsLoading(false);
    console.log('[AuthContext] Auth state initialization complete. isLoading:', false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = (userId: string) => {
    console.log('[AuthContext] Loading user data for:', userId);
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
    console.log('[AuthContext] Clearing user data.');
    setFavorites([]);
    setFollowedUsernames([]);
    setDailyRedesignCount(0);
    setLastRedesignTrackDate(null);
  };

  const login = async (email: string, pass: string) => {
    console.log('[AuthContext] Attempting login with email:', email);
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (pass === "1234" && email) {
      const mockUser: User = { id: email, email, name: email.split('@')[0] };
      console.log('[AuthContext] Mock login successful. User:', mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      loadUserData(mockUser.id);
      toast({ title: "¡Bienvenido de Nuevo!", description: "Has iniciado sesión (simulado)." });
      console.log('[AuthContext] Redirecting to / after successful login.');
      router.push('/'); // Force redirect to home on successful login
    } else {
      console.log('[AuthContext] Mock login failed.');
      toast({ variant: "destructive", title: "Error de Inicio de Sesión", description: "Email o contraseña incorrectos (simulado)." });
    }
    setIsLoading(false);
    console.log('[AuthContext] Login function finished. isLoading set to false.');
  };
  
  const signup = async (name: string, email: string, pass: string) => {
    console.log('[AuthContext] Attempting signup for:', name, email);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && pass && name) {
        const mockUser: User = { id: email, email, name }; 
        console.log('[AuthContext] Mock signup successful. User:', mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        loadUserData(mockUser.id);
        toast({ title: "¡Cuenta Creada!", description: "Has sido registrado (simulado)." });
        console.log('[AuthContext] Redirecting to / after successful signup.');
        router.push('/'); // Force redirect to home on successful signup
    } else {
        console.log('[AuthContext] Mock signup failed. Missing fields.');
        toast({ variant: "destructive", title: "Error de Registro", description: "Por favor completa todos los campos (simulado)." });
    }
    setIsLoading(false);
    console.log('[AuthContext] Signup function finished. isLoading set to false.');
  };


  const logout = () => {
    console.log('[AuthContext] Logging out user...');
    setIsLoading(true);
    localStorage.removeItem('mockUser');
    const userId = user?.id; 
    if (userId) {
        // Keeping user-specific data for potential re-login in mock scenario
        // console.log('[AuthContext] User-specific data for', userId, 'not cleared from localStorage on logout for mock purposes.');
    }
    setUser(null);
    clearUserData(); // This clears state, not necessarily all localStorage for other mock users
    toast({ title: "Sesión Cerrada", description: "Has cerrado sesión correctamente (simulado)." });
    router.push('/auth/signin');
    setIsLoading(false);
    console.log('[AuthContext] Logout complete. isLoading set to false.');
  };

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'createdAt' | 'likes' | 'comments' | 'userHasLiked' | 'title'>) => {
    if (!user) return;
    console.log('[AuthContext] Adding favorite for user:', user.id, 'Item style:', item.style);
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
            newTitle = `${style} ${maxNum > 0 ? maxNum + 1 : 2}`;
        } else {
             newTitle = `${style} ${maxNum + 1}`;
        }
        
      } else {
        newTitle = style; // First item of this style
      }
      
      const newFavorite: FavoriteItem = {
        ...item,
        title: newTitle,
        id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date(),
        likes: Math.floor(Math.random() * 200) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
        userHasLiked: false,
      };
      const updatedFavorites = [newFavorite, ...prevFavorites];
      try {
        localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(updatedFavorites));
        console.log('[AuthContext] Favorite added:', newFavorite.title);
      } catch (e) {
        console.error("[AuthContext] Error guardando favoritos en localStorage:", e);
        toast({variant: "destructive", title: "Error al Guardar", description: "No se pudo guardar el favorito. El almacenamiento podría estar lleno."})
      }
      return updatedFavorites;
    });
  }, [user, toast]);

  const removeFavorite = useCallback((id: string) => {
    if (!user) return;
    console.log('[AuthContext] Removing favorite with id:', id, 'for user:', user.id);
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.filter(fav => fav.id !== id);
      localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [user]);

  const updateFavoriteTitle = useCallback((id: string, newTitle: string) => {
    if (!user) return;
    console.log('[AuthContext] Updating favorite title. ID:', id, 'New Title:', newTitle, 'User:', user.id);
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
    console.log('[AuthContext] Toggling like for favorite ID:', favoriteId, 'User:', user.id);
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
      // console.log('[AuthContext] Resetting redesign count for new day for user:', user.id);
      // No need to call setters here, they will be called in recordRedesignAttempt or if remainingRedesignsToday is checked
      return true;
    }
    return dailyRedesignCount < MAX_REDESIGNS_PER_DAY;
  }, [user, dailyRedesignCount, lastRedesignTrackDate]);

  const recordRedesignAttempt = useCallback(() => {
    if (!user) return;
    const today = getTodayDateString();
    let newCount = dailyRedesignCount;

    if (lastRedesignTrackDate !== today) {
      console.log('[AuthContext] First redesign of the day for user:', user.id);
      newCount = 1;
      setLastRedesignTrackDate(today); // Update state
      localStorage.setItem(`lastRedesignDate_${user.id}`, today); // Update localStorage
    } else {
      newCount = dailyRedesignCount + 1;
    }
    
    setDailyRedesignCount(newCount); // Update state
    localStorage.setItem(`redesignCount_${user.id}`, newCount.toString()); // Update localStorage
    console.log('[AuthContext] Redesign attempt recorded. User:', user.id, 'New count:', newCount);

  }, [user, dailyRedesignCount, lastRedesignTrackDate]);

  const remainingRedesignsToday = useMemo(() => {
    if (!user) return 0;
    const today = getTodayDateString();
    // If the last tracked date is not today, the count effectively resets for the purpose of this calculation.
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
    console.log('[AuthContext] Toggling follow for username:', username, 'User:', user.id);
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
