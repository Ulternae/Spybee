"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { themeSync } from "./theme.sync";
import { useTheme } from "./theme.provider";

const ThemeClassSync = () => {
  const { theme } = useTheme();
  const pathname = usePathname();

  useLayoutEffect(() => {
    themeSync({ theme });
  }, [pathname, theme]);

  return null;
};

export { ThemeClassSync };
