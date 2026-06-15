import { z } from "zod";
import { FORM_STATUS } from "./form-status";

type FormFieldErrors<TValues extends object> = Partial<
  Record<Extract<keyof TValues, string>, string[]>
>;

type InitialFormState<TValues extends object> = {
  status: typeof FORM_STATUS.IDLE;
  values: Partial<TValues>;
  fieldErrors?: never;
  formError?: never;
  data?: never;
};

type ValidationErrorFormState<TValues extends object> = {
  status: typeof FORM_STATUS.ERROR;
  values: Partial<TValues>;
  fieldErrors: FormFieldErrors<TValues>;
  formError?: never;
  data?: never;
};

type FormErrorState<TValues extends object> = {
  status: typeof FORM_STATUS.ERROR;
  values: Partial<TValues>;
  fieldErrors?: never;
  formError: string;
  data?: never;
};

type SuccessFormState<TValues extends object, TData> = {
  status: typeof FORM_STATUS.SUCCESS;
  values: Partial<TValues>;
  fieldErrors?: never;
  formError?: never;
  data?: TData;
};

type FormActionState<
  TValues extends object,
  TData = undefined,
> =
  | InitialFormState<TValues>
  | ValidationErrorFormState<TValues>
  | FormErrorState<TValues>
  | SuccessFormState<TValues, TData>;

const createInitialFormState = <TValues extends object>(
  values: Partial<TValues> = {},
): InitialFormState<TValues> => ({
  status: FORM_STATUS.IDLE,
  values,
});

const createValidationErrorState = <TValues extends object>(
  values: Partial<TValues>,
  error: z.ZodError<TValues>,
): ValidationErrorFormState<TValues> => ({
  status: FORM_STATUS.ERROR,
  values,
  fieldErrors: z.flattenError(error).fieldErrors as FormFieldErrors<TValues>,
});

const createFormErrorState = <TValues extends object>(
  values: Partial<TValues>,
  formError: string,
): FormErrorState<TValues> => ({
  status: FORM_STATUS.ERROR,
  values,
  formError,
});

const createSuccessFormState = <
  TValues extends object,
  TData = undefined,
>(
  values: Partial<TValues>,
  data?: TData,
): SuccessFormState<TValues, TData> => ({
  status: FORM_STATUS.SUCCESS,
  values,
  data,
});

export {
  createFormErrorState,
  createInitialFormState,
  createSuccessFormState,
  createValidationErrorState,
};

export type { FormActionState, FormFieldErrors };
