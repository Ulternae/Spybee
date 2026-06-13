import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./input.module.scss";

interface InputProps extends ComponentProps<"input"> {
  containerClassName?: string;
  errorOverlayClassName?: string;
  isInvalid?: boolean;
  showErrorLabel?: boolean;
}

function Input({
  className,
  containerClassName,
  errorOverlayClassName,
  isInvalid = false,
  showErrorLabel = false,
  type,
  ...props
}: InputProps) {
  return (
    <div className={cn(styles.container, containerClassName)}>
      <input
        {...props}
        type={type}
        data-slot="input"
        aria-invalid={isInvalid || props["aria-invalid"]}
        className={cn(styles.input, className)}
      />
      {showErrorLabel && isInvalid && props.placeholder && (
        <span className={cn(styles.errorOverlay, errorOverlayClassName)}>
          {props.placeholder}
        </span>
      )}
    </div>
  );
}

export { Input };
export type { InputProps };
