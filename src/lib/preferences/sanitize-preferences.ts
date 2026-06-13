import type { Theme } from "@/store/theme/theme.types";

const isTheme = (theme: unknown): theme is Theme => {
  return theme === "light" || theme === "dark";
};

export { isTheme }