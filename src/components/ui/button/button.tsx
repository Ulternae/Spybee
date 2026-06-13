import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./button.module.scss";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.root, styles[variant], styles[size], className)}
      {...props}
    />
  );
}
