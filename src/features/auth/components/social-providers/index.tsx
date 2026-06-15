"use client";

import { MinaBrandGoogle } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import { authClient } from "@/lib/auth/client";
import styles from "./social-providers.module.scss";

const SocialProviders = () => {

  const t = useTranslations("auth.oauth");
  const { currentLocale } = useLocale();

  const signInWithGoogle = () => {
    void authClient.signIn.social({
      provider: "google",
      callbackURL: `/${currentLocale}`,
      errorCallbackURL: `/${currentLocale}/login`,
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={signInWithGoogle}
      className={styles.provider}
    >
      <MinaBrandGoogle aria-hidden="true" />
      <span>{t("google")}</span>
    </Button>
  );
};

export { SocialProviders };
