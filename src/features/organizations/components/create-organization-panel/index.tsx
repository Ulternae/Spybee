import { getTranslations } from "next-intl/server";
import { CreateOrganizationForm } from "../create-organization-form";
import styles from "./create-organization-panel.module.scss";

const CreateOrganizationPanel = async () => {
  const t = await getTranslations("organizations.new");

  return (
    <main className={styles.root}>
      <div className={styles.hero}>
        <h2>{t("heading")}</h2>
        <p>{t("members_description")}</p>
      </div>

      <div className={styles.formArea}>
        <CreateOrganizationForm />
      </div>
    </main>
  );
};

export { CreateOrganizationPanel };
