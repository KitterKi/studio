
'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme('system');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="h-9 w-9" />; 
  }

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system'; 
      return 'light'; 
    });
  };
  
  let IconToShow = Moon;
  let tooltipText = "Cambiar a Modo Oscuro";

  const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (theme === 'dark') {
    IconToShow = Sun;
    tooltipText = "Cambiar a Preferencia del Sistema";
  } else if (theme === 'light') {
    IconToShow = Moon;
    tooltipText = "Cambiar a Modo Oscuro";
  } else { // theme === 'system'
    if (systemIsDark) {
      IconToShow = Sun;
      tooltipText = "Cambiar a Modo Claro";
    } else {
      IconToShow = Moon;
      tooltipText = "Cambiar a Modo Oscuro";
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={tooltipText}>
      <IconToShow className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
