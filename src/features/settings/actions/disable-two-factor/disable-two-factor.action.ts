"use client";

import {
  createFormErrorState,
  createSuccessFormState,
  createValidationErrorState,
} from "@/lib/forms/form-action-state";
import { extractErrorCode } from "@/lib/errors/extract-error-code";
import { authClient } from "@/lib/auth/client";

import {
  type DisableTwoFactorInput,
  disableTwoFactorSchema,
} from "../../schemas/disable-two-factor.schema";
import type { DisableTwoFactorState } from "../../types/form.types";
import { sendNotification } from "@/lib/server/notifications/send-notification.server";
import { NOTIFICATION_TYPE } from "@/lib/server/notifications/notification.types";

const disableTwoFactorAction = async (
  _: DisableTwoFactorState,
  formData: FormData,
): Promise<DisableTwoFactorState> => {
  const data = Object.fromEntries(formData);

  const values: DisableTwoFactorInput = {
    password: String(data.password ?? ""),
  };

  const parsed = disableTwoFactorSchema.safeParse(values);

  if (!parsed.success) {
    return createValidationErrorState(values, parsed.error);
  }

  try {
    const { error } = await authClient.twoFactor.disable({
      password: parsed.data.password,
    });

    if (error) {
      return createFormErrorState(values, extractErrorCode(error));
    }

    await sendNotification({ type: NOTIFICATION_TYPE.TWO_FACTOR_DISABLED });

    return createSuccessFormState(values);
  } catch (error: unknown) {
    return createFormErrorState(values, extractErrorCode(error));
  }
};

export { disableTwoFactorAction };