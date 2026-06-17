"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FormErrors } from "@/components/common/form-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { createOrganizationAction } from "../../actions/create-organization/create-organization.action";
import type { CreateOrganizationState } from "../../types/form.types";
import styles from "./create-organization-form.module.scss";

const INITIAL_STATE: CreateOrganizationState = {
  status: FORM_STATUS.IDLE,
  values: {
    name: "",
  },
};

const CreateOrganizationForm = () => {

  const [state, action, isPending] = useActionState<CreateOrganizationState, FormData>(createOrganizationAction, INITIAL_STATE);
  const t = useTranslations("organizations.new");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const isCompleted = state.status === FORM_STATUS.SUCCESS;

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    router.replace("/");
  }, [router, state.status]);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.fields}>
        <Input
          containerClassName={styles.input}
          name="name"
          autoComplete="organization"
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

export { CreateOrganizationForm };
