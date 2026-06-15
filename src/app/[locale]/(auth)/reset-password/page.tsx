import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { redirect } from "@/i18n/navigation";
import styles from "../auth-page.module.scss";

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

const ResetPasswordPage = async ({
  params,
  searchParams,
}: ResetPasswordPageProps) => {
  const [{ locale }, { token }] = await Promise.all([params, searchParams]);
  const t = await getTranslations("auth");

  if (typeof token !== "string") {
    redirect({ href: "/forgot-password", locale });
  }

  const resetToken = token as string;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {t("screens.reset_password.title")}
        </h1>
        <p className={styles.subtitle}>
          {t("screens.reset_password.subtitle")}
        </p>
      </div>

      <ResetPasswordForm token={resetToken} />
    </div>
  );
};

export default ResetPasswordPage;
