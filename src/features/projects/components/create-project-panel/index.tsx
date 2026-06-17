import { getTranslations } from "next-intl/server";
import { CreateProjectForm } from "../create-project-form";
import styles from "./create-project-panel.module.scss";

const CreateProjectPanel = async () => {
  const t = await getTranslations("projects.new");

  return (
    <main className={styles.root}>
      <div className={styles.hero}>
        <h2>{t("heading")}</h2>
        <p>{t("description")}</p>
      </div>

      <div className={styles.formArea}>
        <CreateProjectForm />
      </div>
    </main>
  );
};

export { CreateProjectPanel };
