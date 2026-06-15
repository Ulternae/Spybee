const FORM_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  SUCCESS: "success",
} as const;

type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS];

export { FORM_STATUS };
export type { FormStatus };
