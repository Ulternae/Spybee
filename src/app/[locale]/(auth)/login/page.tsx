import { getTranslations } from "next-intl/server";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { SocialProviders } from "@/features/auth/components/social-providers";
import styles from "../auth-page.module.scss";

const LoginPage = async () => {
  const t = await getTranslations("auth");

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("screens.sign_in.title")}</h1>
        <p className={styles.subtitle}>{t("screens.sign_in.subtitle")}</p>
      </div>

      <SignInForm />

      <div className={styles.social}>
        <div className={styles.separator}>
          <span>{t("oauth.separator")}</span>
        </div>
        <SocialProviders />
      </div>
    </div>
  );
};

export default LoginPage;
