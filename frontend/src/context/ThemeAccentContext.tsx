import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import ColorThief from 'color-thief-browser';
import backgroundLight from '../assets/background-light.png';
import backgroundDark from '../assets/background-dark.png';

// Types
export type ThemeMode = 'light' | 'dark';

interface ThemeAccentContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  accentColor: string;
}

const ThemeAccentContext = createContext<ThemeAccentContextType | undefined>(undefined);

export const useThemeAccent = () => {
  const ctx = useContext(ThemeAccentContext);
  if (!ctx) throw new Error('useThemeAccent must be used within ThemeAccentProvider');
  return ctx;
};

const fallbackAccent: Record<ThemeMode, string> = {
  light: '#1976d2',
  dark: '#90caf9',
};

const backgroundImages: Record<ThemeMode, string> = {
  light: backgroundLight,
  dark: backgroundDark,
};

export const ThemeAccentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [accentColor, setAccentColor] = useState<string>(fallbackAccent.light);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = backgroundImages[mode];
    img.onload = () => {
      try {
        const [r, g, b] = ColorThief.getColor(img);
        setAccentColor(`rgb(${r},${g},${b})`);
      } catch {
        setAccentColor(fallbackAccent[mode]);
      }
    };
    img.onerror = () => setAccentColor(fallbackAccent[mode]);
    // Cleanup
    return () => { img.onload = null; img.onerror = null; };
  }, [mode]);

  const value = useMemo(() => ({
    mode,
    toggleMode: () => setMode((m: ThemeMode) => (m === 'light' ? 'dark' : 'light')),
    accentColor,
  }), [mode, accentColor]);

  return (
    <ThemeAccentContext.Provider value={value}>
      {children}
    </ThemeAccentContext.Provider>
  );
}; 