import { getTranslations } from "next-intl/server";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { SocialProviders } from "@/features/auth/components/social-providers";
import styles from "../auth-page.module.scss";

const SignupPage = async () => {
  const t = await getTranslations("auth");

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("screens.sign_up.title")}</h1>
        <p className={styles.subtitle}>{t("screens.sign_up.subtitle")}</p>
      </div>

      <SignUpForm />

      <div className={styles.social}>
        <div className={styles.separator}>
          <span>{t("oauth.separator")}</span>
        </div>
        <SocialProviders />
      </div>
    </div>
  );
};

export default SignupPage;
