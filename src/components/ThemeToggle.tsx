
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
      // No need to store 'system' explicitly if we want it to be dynamic
      // localStorage.setItem('theme', 'system'); 
      // Or, if you want to resolve 'system' to light/dark upon selection:
      // localStorage.setItem('theme', systemTheme);
      // For this implementation, 'system' means "follow OS"
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch
    return <div className="h-9 w-9" />; // Matches button size="icon"
  }

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system'; // Cycle: light -> dark -> system -> light
      return 'light'; // system goes to light
    });
  };
  
  const Icon = theme === 'dark' ? Sun : Moon;
  let tooltipText = "Switch to Dark Mode";
  if (theme === 'dark') tooltipText = "Switch to System Preference";
  if (theme === 'system') tooltipText = "Switch to Light Mode";
   // If system is dark, Moon is shown, tooltip "Switch to Light Mode"
  if (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
     // Icon becomes Sun
     tooltipText = "Switch to Light Mode";
  }


  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={tooltipText}>
      {theme === 'dark' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'light' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'system' && (
        window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? <Sun className="h-[1.2rem] w-[1.2rem]" /> 
        : <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
