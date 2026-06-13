export type Theme = "light" | "dark"
export interface ThemePreferenceContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
