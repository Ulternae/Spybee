"use client";

import { APPEARANCE_THEME_STORAGE_KEY, DEFAULT_THEME } from "@/lib/preferences/preferences.constants";

const storageKey = JSON.stringify(APPEARANCE_THEME_STORAGE_KEY);
const fallbackTheme = JSON.stringify(DEFAULT_THEME);

const themeInitializationScript = `
  (function () {
    var theme = ${fallbackTheme};

    try {
      var storedTheme = localStorage.getItem(${storageKey});

      if (storedTheme === "light" || storedTheme === "dark") {
        theme = storedTheme;
      }
    } catch (_) {}

    var root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  })();
`;

const ThemeInitializationScript = () => {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
    />
  );
};

export { ThemeInitializationScript };
