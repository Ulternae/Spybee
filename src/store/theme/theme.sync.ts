import { APPEARANCE_THEME_STORAGE_KEY } from "@/lib/preferences/preferences.constants";
import { Theme } from "./theme.types";

interface ThemeSyncProps {
  theme: Theme;
}

const themeSync = ({ theme }: ThemeSyncProps) => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  localStorage.setItem(APPEARANCE_THEME_STORAGE_KEY, theme);
};

export { themeSync };
