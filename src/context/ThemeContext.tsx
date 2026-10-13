"use client";
// src/context/ThemeContext.tsx
// Manages light/dark theme toggle with localStorage persistence.
// Light is the default theme.

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/styles/theme";
import type { AppTheme } from "@/styles/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  // Read saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved === "dark" || saved === "light") {
      setMode(saved);
    }
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  const activeTheme = (mode === "dark" ? darkTheme : lightTheme) as AppTheme;

  // Prevent flash of wrong theme on SSR by rendering light-themed initially
  // (matches the server render), then hydrating the saved theme on client
  if (!mounted) {
    return (
      <SCThemeProvider theme={lightTheme}>
        <ThemeContext.Provider value={{ mode: "light", toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      </SCThemeProvider>
    );
  }

  return (
    <SCThemeProvider theme={activeTheme}>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </SCThemeProvider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
