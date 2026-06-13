"use client";

import { MinaMinus } from "@zcorvus/icons-react";
import {
  OTPInput,
  OTPInputContext,
  type OTPInputProps as OTPInputPrimitiveProps,
} from "input-otp";
import { useContext, type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./input-otp.module.scss";

type InputOTPProps = OTPInputPrimitiveProps;

function InputOTP({
  className,
  containerClassName,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(styles.container, containerClassName)}
      className={cn(styles.input, className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(styles.group, className)}
      {...props}
    />
  );
}

interface InputOTPSlotProps extends ComponentProps<"div"> {
  index: number;
}

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } =
    inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(styles.slot, className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <span className={styles.caretContainer}>
          <span className={styles.caret} />
        </span>
      )}
    </div>
  );
}

function InputOTPSeparator({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(styles.separator, className)}
      {...props}
    >
      <MinaMinus />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
export type { InputOTPProps };
