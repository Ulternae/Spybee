import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AppPreferences } from "@/components/common/app-preferences";
import { Link } from "@/i18n/navigation";
import styles from "./auth-shell.module.scss";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/common/logo";

/* eslint-disable @next/next/no-img-element */

interface AuthShellProps {
  children: ReactNode;
}

const AuthShell = async ({ children }: AuthShellProps) => {
  const t = await getTranslations("common");
  const brand = t("brand");

  return (
    <main className={styles.root}>
      <section className={styles.content}>
        <Link href="/" className={styles.brand} aria-label={brand}>
          <Logo />
          <span>{brand}</span>
        </Link>

        <div className={styles.formContainer}>{children}</div>
      </section>

      <aside className={styles.visual} aria-label={brand}>
        <div className={styles.backgroundContainer}>
          <img src="/auth/background-light.png" alt="" className={cn(styles.background, styles.backgroundLight)} />
          <img src="/auth/background-dark.png" alt="" className={cn(styles.background, styles.backgroundDark)} />
        </div>
        <h1 className={styles.productName}>{brand}</h1>
        <AppPreferences className={styles.preferences} />
      </aside>
    </main>
  );
};

export { AuthShell };
