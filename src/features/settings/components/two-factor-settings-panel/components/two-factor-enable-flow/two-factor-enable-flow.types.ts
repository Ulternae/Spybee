import type { TwoFactorSetupData } from "@/features/settings/types/two-factor.types";

const TWO_FACTOR_ENABLE_STEPS = {
  PASSWORD: "password",
  QR: "qr",
  CODE: "code",
  BACKUP_CODES: "backup_codes",
} as const;

type TwoFactorEnableStep =
  (typeof TWO_FACTOR_ENABLE_STEPS)[keyof typeof TWO_FACTOR_ENABLE_STEPS];

export { TWO_FACTOR_ENABLE_STEPS };
export type { TwoFactorEnableStep, TwoFactorSetupData };
