import { getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import styles from "../auth-page.module.scss";

const ForgotPasswordPage = async () => {
  const t = await getTranslations("auth");

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {t("screens.forgot_password.title")}
        </h1>
        <p className={styles.subtitle}>
          {t("screens.forgot_password.subtitle")}
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
