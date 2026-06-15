import { getTranslations } from "next-intl/server";
import { TwoFactorForm } from "@/features/auth/components/two-factor-form";
import styles from "../auth-page.module.scss";

const TwoFactorAuthenticationPage = async () => {
  const t = await getTranslations("auth");

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {t("screens.two_factor.title")}
        </h1>
        <p className={styles.subtitle}>
          {t("screens.two_factor.subtitle")}
        </p>
      </div>

      <TwoFactorForm />
    </div>
  );
};

export default TwoFactorAuthenticationPage;
