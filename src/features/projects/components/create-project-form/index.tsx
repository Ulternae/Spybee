"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FormErrors } from "@/components/common/form-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { createProjectAction } from "../../actions/create-project/create-project.action";
import type { CreateProjectState } from "../../types/form.types";
import styles from "./create-project-form.module.scss";

const INITIAL_STATE: CreateProjectState = {
  status: FORM_STATUS.IDLE,
  values: {
    name: "",
  },
};

const CreateProjectForm = () => {

  const [state, action, isPending] = useActionState<CreateProjectState, FormData>(createProjectAction, INITIAL_STATE);
  const t = useTranslations("projects.new");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const isCompleted = state.status === FORM_STATUS.SUCCESS;

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    router.replace("/projects");
    router.refresh();
  }, [router, state.status]);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.fields}>
        <Input
          containerClassName={styles.input}
          name="name"
          autoComplete="off"
          placeholder={t("name_placeholder")}
          defaultValue={state.values.name}
          isInvalid={Boolean(state.fieldErrors?.name)}
          required
          disabled={isPending || isCompleted}
        />
        <Button type="submit" disabled={isPending || isCompleted}>
          {isPending || isCompleted
            ? tCommon("actions.loading")
            : tCommon("actions.create")}
        </Button>
      </div>

      <p className={styles.hint}>{t("name_hint")}</p>

      <FormErrors
        fieldErrors={state.fieldErrors}
        formError={state.formError}
      />
    </form>
  );
};

export { CreateProjectForm };
