"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { MinaLanguage, MinaMoon, MinaSun } from "@zcorvus/icons-react";
import { useTheme } from "@/store/theme/theme.provider";
import type { Theme } from "@/store/theme/theme.types";
import styles from "./appearance-switcher.module.scss";

interface AppearanceSwitcherProps {
  className?: string;
}

const ThemeButton = ({ theme }: { theme: Theme }) => {
  if (theme === "dark") {
    return <MinaSun className={styles.icon} />;
  }

  return <MinaMoon className={styles.icon} />;
};

const AppearanceSwitcher = ({ className }: AppearanceSwitcherProps) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { nextLocale } = useLocale();
  const t = useTranslations("common.accessibility");

  return (
    <div className={cn(styles.root, className)}>
      <Button
        variant="secondary"
        size="icon"
        onClick={toggleTheme}
        aria-label={t("toggle_theme")}
      >
        <ThemeButton theme={theme} />
      </Button>
      <Button variant="secondary" size="icon" asChild>
        <Link
          href={pathname}
          locale={nextLocale}
          aria-label={t("change_language")}
        >
          <MinaLanguage className={styles.icon} />
        </Link>
      </Button>
    </div>
  );
};

export { AppearanceSwitcher };
