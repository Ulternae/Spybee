import { APIError } from "better-auth";
import { z } from "zod";

type FormFieldErrors<TValues extends object> = Partial<
  Record<Extract<keyof TValues, string> | "error", string[]>
>;

type FormActionState<
  TValues extends object,
  TExtra extends object = object,
> = {
  success: boolean;
  error: string | null;
  values: TValues;
  fieldErrors?: FormFieldErrors<TValues>;
} & TExtra;

const createFormErrorState = <TValues extends object>(
  values: TValues,
): FormActionState<TValues> => ({
  success: false,
  error: null,
  fieldErrors: undefined,
  values,
});

const createValidationErrorState = <TValues extends object>(
  values: TValues,
  error: z.ZodError,
): FormActionState<TValues> => ({
  ...createFormErrorState(values),
  fieldErrors: z.flattenError(error).fieldErrors as FormFieldErrors<TValues>,
  error: "Validation failed",
});

const createBackendErrorState = <TValues extends object>(
  values: TValues,
  code = "GENERIC_ERROR",
): FormActionState<TValues> => ({
  ...createFormErrorState(values),
  error: "Backend error",
  fieldErrors: {
    error: [code],
  } as FormFieldErrors<TValues>,
});

const extractErrorCode = (error: unknown) => {
  if (error instanceof APIError) {
    return error.body?.code ?? "GENERIC_ERROR";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "GENERIC_ERROR";
}

export {
  createBackendErrorState,
  createFormErrorState,
  createValidationErrorState,
  extractErrorCode,
};

export type { FormActionState, FormFieldErrors };
