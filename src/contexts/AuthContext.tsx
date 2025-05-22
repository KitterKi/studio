
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
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
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedFavorites = localStorage.getItem('userFavorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites).map((fav: FavoriteItem) => ({
          ...fav,
          createdAt: new Date(fav.createdAt) // Ensure createdAt is a Date object
        })));
      }
    } catch (error) {
      console.error("Error loading from localStorage", error);
      localStorage.removeItem('authUser');
      localStorage.removeItem('userFavorites');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, _pass: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: 'mock-user-id-' + Date.now(), email, name: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    // Load favorites for this mock user (or clear if implementing per-user storage)
    // For simplicity, current favorites are global or tied to the single localStorage item
    setIsLoading(false);
    router.push('/');
  }, [router]);

  const signup = useCallback(async (email: string, _pass: string, name?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: 'mock-user-id-' + Date.now(), email, name: name || email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setFavorites([]); // Clear favorites for new user
    localStorage.setItem('userFavorites', JSON.stringify([]));
    setIsLoading(false);
    router.push('/');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authUser');
    // Optionally clear favorites on logout or handle them per-user
    // setFavorites([]); 
    // localStorage.removeItem('userFavorites');
    router.push('/auth/signin');
  }, [router]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'createdAt'>) => {
    setFavorites(prevFavorites => {
      const newFavorite: FavoriteItem = {
        ...item,
        id: `fav-${Date.now()}`,
        createdAt: new Date(),
      };
      const updatedFavorites = [newFavorite, ...prevFavorites];
      localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
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


  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, favorites, addFavorite, removeFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};
