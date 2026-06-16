"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/ui/input-password";
import { FormErrors } from "@/components/common/form-errors";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { disableTwoFactorAction } from "@/features/settings/actions/disable-two-factor/disable-two-factor.action";
import type { DisableTwoFactorState } from "@/features/settings/types/form.types";
import styles from "../../two-factor-settings-panel.module.scss";

interface TwoFactorDisableFormProps {
  onCompleted: () => void;
}

const INITIAL_STATE: DisableTwoFactorState = {
  status: FORM_STATUS.IDLE,
  values: {
    password: "",
  },
};

const TwoFactorDisableForm = ({ onCompleted }: TwoFactorDisableFormProps) => {
  const t = useTranslations("settings.security.two_factor");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [state, action, isPending] = useActionState<DisableTwoFactorState, FormData>(disableTwoFactorAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    toast.success(t("disabled"));
    onCompleted();
    router.refresh();
  }, [onCompleted, router, state.status, t]);

  return (
    <form action={action} className={styles.flow}>
      <InputPassword
        name="password"
        autoComplete="current-password"
        placeholder={tCommon("fields.currentPassword")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isPending}
      />

      <FormErrors
        fieldErrors={state.fieldErrors}
        formError={state.formError}
      />

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="destructive"
          disabled={isPending || !password}
        >
          {isPending ? tCommon("actions.loading") : t("disable")}
        </Button>
      </div>
    </form>
  );
};

export { TwoFactorDisableForm };
