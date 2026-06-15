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
  const [tCommon, tAuth] = await Promise.all([
    getTranslations("common"),
    getTranslations("auth.shell"),
  ]);
  const brand = tCommon("brand");

  return (
    <main className={styles.root}>
      <section className={styles.content}>
        <Link href="/" className={styles.brand} aria-label={brand}>
          <Logo />
          <span>{brand}</span>
        </Link>

        <div className={styles.formContainer}>{children}</div>

        <AppPreferences className={styles.mobilePreferences} />
      </section>

      <aside className={styles.visual} aria-label={brand}>
        <div className={styles.backgroundContainer}>
          <img src="/auth/background-light.png" alt="" className={cn(styles.background, styles.backgroundLight)} />
          <img src="/auth/background-dark.png" alt="" className={cn(styles.background, styles.backgroundDark)} />
        </div>
        <section className={styles.productName}>
          <h1>{tAuth("title")}</h1>
          <h2>{tAuth("description")}</h2>
        </section>
        <AppPreferences className={styles.preferences} />
      </aside>
    </main>
  );
};

export { AuthShell };
