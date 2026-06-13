"use client";

import { Fragment } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  type InputOTPProps,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils/cn";
import styles from "./input-otp-method.module.scss";

const METHOD_AUTH = {
  BACKUP: "backup",
  TOTP: "totp",
} as const;

type MethodAuth = (typeof METHOD_AUTH)[keyof typeof METHOD_AUTH];

interface InputOTPMethodProps
  extends Omit<
    InputOTPProps,
    "maxLength" | "render" | "children"
  > {
  method: MethodAuth;
  inputSlotClassName?: string;
  showSeparator?: boolean;
}

function InputOTPMethod({
  method,
  className,
  containerClassName,
  inputSlotClassName,
  showSeparator = true,
  ...props
}: InputOTPMethodProps) {
  const totalSlots = method === METHOD_AUTH.TOTP ? 6 : 11;

  return (
    <InputOTP
      {...props}
      maxLength={totalSlots}
      className={className}
      containerClassName={cn(styles.container, containerClassName)}
    >
      <InputOTPGroup className={styles.group}>
        {Array.from({ length: totalSlots }, (_, index) => {
          const isMiddle = totalSlots % 2 === 0 && index === totalSlots / 2;

          return (
            <Fragment key={index}>
              {isMiddle && showSeparator && (
                <span className={styles.gap} aria-hidden="true" />
              )}
              <InputOTPSlot
                className={cn(styles.slot, inputSlotClassName)}
                index={index}
              />
            </Fragment>
          );
        })}
      </InputOTPGroup>
    </InputOTP>
  );
}

export { InputOTPMethod, METHOD_AUTH };
export type { InputOTPMethodProps, MethodAuth };
