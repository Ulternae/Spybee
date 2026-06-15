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
import { signInAction } from "../../actions/sign-in/sign-in.action";
import { AuthPendingState } from "../auth-pending-state";
import type { SignInState } from "../../types/form.types";
import styles from "./sign-in-form.module.scss";

const INITIAL_STATE: SignInState = {
  status: FORM_STATUS.IDLE,
  values: {
    email: "",
    password: "",
  },
};

const SignInForm = () => {

  const [state, action, isPending] = useActionState<SignInState, FormData>(signInAction, INITIAL_STATE);

  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const router = useRouter();

  const isCompleted = state.status === FORM_STATUS.SUCCESS;
  const twoFactorRedirect = state.status === FORM_STATUS.SUCCESS && Boolean(state.data?.twoFactorRedirect);

  const fieldErrorCount = Object.keys(state.fieldErrors ?? {}).length;
  const showErrorLabel = fieldErrorCount > 1;

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) return;

    router.replace(twoFactorRedirect ? "/2fa" : "/");
  }, [router, state.status, twoFactorRedirect]);

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
            autoComplete="current-password"
            placeholder={tCommon("fields.password")}
            defaultValue={state.values.password}
            isInvalid={Boolean(state.fieldErrors?.password)}
            showErrorLabel={showErrorLabel}
            required
          />

          <Button
            variant="link"
            size="sm"
            asChild
            className={styles.forgotPassword}
          >
            <Link href="/forgot-password">
              {tAuth("actions.forgot_password")}
            </Link>
          </Button>

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
          aria-label={tAuth("actions.create_account")}
        >
          <Link href="/signup">
            <MinaLogin aria-hidden="true" />
          </Link>
        </Button>
        <Button type="submit" disabled={isPending || isCompleted}>
          {isPending ? tCommon("actions.loading") : tAuth("actions.sign_in")}
        </Button>
      </div>
    </form>
  );
};

export { SignInForm };
