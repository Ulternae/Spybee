"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { MinaLanguage, MinaMoon, MinaSun } from "@zcorvus/icons-react";
import { useTheme } from "@/store/theme/theme.provider";
import styles from "./app-preferences.module.scss";

interface AppPreferencesProps {
  className?: string;
}

const AppPreferences = ({ className }: AppPreferencesProps) => {
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
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
        <MinaSun
          aria-hidden="true"
          className={cn(styles.icon, styles.sunIcon)}
        />
        <MinaMoon
          aria-hidden="true"
          className={cn(styles.icon, styles.moonIcon)}
        />
      </Button>
      <Button variant="secondary" size="icon" asChild>
        <Link
          href={pathname}
          locale={nextLocale}
          aria-label={t("change_language")}
        >
          <MinaLanguage aria-hidden="true" className={styles.icon} />
        </Link>
      </Button>
    </div>
  );
};

export { AppPreferences };
