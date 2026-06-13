"use client";

import { MinaEye, MinaEyeSlash } from "@zcorvus/icons-react";
import { useId, useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import styles from "./input-password.module.scss";

type InputPasswordProps = InputProps & ComponentProps<"input">;

function InputPassword({
  className,
  containerClassName,
  errorOverlayClassName,
  id: providedId,
  ...props
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <div className={cn(styles.container, containerClassName)}>
      <Input
        id={id}
        className={cn(styles.input, className)}
        containerClassName={styles.inputContainer}
        errorOverlayClassName={cn(styles.errorOverlay, errorOverlayClassName)}
        {...props}
        type={isVisible ? "text" : "password"}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-controls={id}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((current) => !current)}
        className={styles.toggle}
      >
        {isVisible ? <MinaEyeSlash /> : <MinaEye />}
        <span className={styles.srOnly}>
          {isVisible ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}

export { InputPassword };
