"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { isTheme } from "@/lib/preferences/sanitize-preferences";
import { APPEARANCE_THEME_STORAGE_KEY, DEFAULT_THEME } from "@/lib/preferences/preferences.constants";
import type { Theme, ThemePreferenceContextValue } from "./theme.types";

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return DEFAULT_THEME;

  const storedTheme = localStorage.getItem(APPEARANCE_THEME_STORAGE_KEY);

  return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const value = useMemo<ThemePreferenceContextValue>(
    () => ({
      theme,
      setTheme: (nextTheme) => setThemeState(nextTheme),
      toggleTheme: () =>
        setThemeState((currentTheme) =>
          currentTheme === "dark" ? "light" : "dark",
        ),
    }),
    [theme],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemePreferenceContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { ThemeProvider, useTheme };
