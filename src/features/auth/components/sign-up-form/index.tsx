"use client";

import { useActionState, useEffect } from "react";
import { MinaLogin } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { FormErrors } from "@/components/common/form-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Link, useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { signUpAction } from "../../actions/sign-up/sign-up.action";
import { AuthPendingState } from "../auth-pending-state";
import type { SignUpState } from "../../types/form.types";
import styles from "./sign-up-form.module.scss";

const INITIAL_STATE: SignUpState = {
  status: FORM_STATUS.IDLE,
  values: {
    email: "",
    name: "",
  },
};

const SignUpForm = () => {

  const [state, action, isPending] = useActionState<SignUpState, FormData>(signUpAction, INITIAL_STATE);
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const isCompleted = state.status === FORM_STATUS.SUCCESS;
  const fieldErrorCount = Object.keys(state.fieldErrors ?? {}).length;
  const showErrorLabel = fieldErrorCount > 1;

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    router.replace("/");
  }, [router, state.status]);

  return (
    <form action={action} className={styles.form}>
      {isCompleted ? (
        <AuthPendingState
          className={styles.completed}
          label={tCommon("actions.redirecting")}
        />
      ) : (
        <>
          <Input
            type="text"
            name="name"
            autoComplete="name"
            placeholder={tCommon("fields.name")}
            defaultValue={state.values.name}
            isInvalid={Boolean(state.fieldErrors?.name)}
            showErrorLabel={showErrorLabel}
            required
          />
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={tCommon("fields.email")}
            defaultValue={state.values.email}
            isInvalid={Boolean(state.fieldErrors?.email)}
            showErrorLabel={showErrorLabel}
            required
          />
          <InputPassword
            name="password"
            autoComplete="new-password"
            placeholder={tCommon("fields.password")}
            isInvalid={Boolean(state.fieldErrors?.password)}
            showErrorLabel={showErrorLabel}
            required
          />

          <FormErrors
            fieldErrors={state.fieldErrors}
            formError={state.formError}
          />
        </>
      )}

      <div className={styles.actions}>
        <Button
          variant="outline"
          size="icon"
          asChild
          aria-label={tAuth("actions.sign_in")}
        >
          <Link href="/login">
            <MinaLogin aria-hidden="true" />
          </Link>
        </Button>
        <Button type="submit" disabled={isPending || isCompleted}>
          {isPending ? tCommon("actions.loading") : tAuth("actions.sign_up")}
        </Button>
      </div>
    </form>
  );

};

export { SignUpForm };
