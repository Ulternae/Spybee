import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { AppPreferences } from "@/components/common/app-preferences";
import type { SettingsAccount } from "../../queries/get-settings-account";
import styles from "./general-settings-panel.module.scss";
import { cn } from "@/lib/utils/cn";
import { PasswordSettingsDialog } from "../password-settings-dialog";

interface GeneralSettingsPanelProps {
  account: SettingsAccount;
}

const formatMonthYear = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
};

const GeneralSettingsPanel = async ({ account }: GeneralSettingsPanelProps) => {
  const t = await getTranslations("settings.general");
  const tAccount = await getTranslations("layout.user_menu");
  const locale = await getLocale();

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </header>
      <section className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{t("personal.title")}</h2>
            <p>{t("personal.description")}</p>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataItem}>
              <span>{tAccount("name")}</span>
              <p>{account.user.name}</p>
            </div>
            <div className={styles.dataItem}>
              <span>{t("personal.role")}</span>
              <p>{t("personal.default_role")}</p>
            </div>
            <div className={styles.dataItem}>
              <span>{tAccount("email")}</span>
              <p>{account.user.email}</p>
            </div>
            <div className={styles.dataItem}>
              <span>{tAccount("member_since")}</span>
              <p>{formatMonthYear(account.user.createdAt, locale)}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{t("preferences.title")}</h2>
            <p>{t("preferences.description")}</p>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataItem}>
              <span>{tAccount("language")}</span>
              <p>{tAccount(`locales.${locale}`)}</p>
            </div>
            <div className={styles.preferences}>
              <AppPreferences />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{t("security.title")}</h2>
            <p>{t("security.description")}</p>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataItem}>
              <span>{tAccount("account_verification")}</span>
              <Badge variant={account.user.emailVerified ? "default" : "outline"}>
                {account.user.emailVerified
                  ? tAccount("verified")
                  : tAccount("not_verified")}
              </Badge>
            </div>
            <div className={cn(styles.dataItemWithIcon)}>
              <PasswordSettingsDialog hasPassword={account.hasPassword} />
              <div className={styles.dataItem}>
                <span>{t("security.password")}</span>
                <Badge variant={account.hasPassword ? "default" : "secondary"}>
                  {account.hasPassword
                    ? t("security.enabled")
                    : t("security.pending")}
                </Badge>
              </div>

            </div>
            <div className={styles.dataItem}>
              <span>2FA</span>
              <Badge variant={account.user.twoFactorEnabled ? "default" : "secondary"}>
                {account.user.twoFactorEnabled
                  ? t("security.enabled")
                  : t("security.disabled")}
              </Badge>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{t("providers.title")}</h2>
            <p>{t("providers.description")}</p>
          </div>
          <div className={styles.providers}>
            {account.providers.map((provider) => (
              <Badge key={provider} variant="outline">
                {provider}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </main>

  );
};

export { GeneralSettingsPanel };
