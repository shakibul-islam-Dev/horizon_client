'use client';

import { createContext, useContext, useCallback, useMemo, useEffect, useSyncExternalStore, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getStoredTheme, () => 'light' as Theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    window.dispatchEvent(new Event('storage'));
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: 'light' as Theme, toggleTheme: () => {} };
  }
  return ctx;
}
