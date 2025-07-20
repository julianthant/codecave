'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface CodeCaveThemeProviderProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const ThemeProvider: React.FC<CodeCaveThemeProviderProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider; 