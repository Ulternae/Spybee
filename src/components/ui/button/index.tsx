import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import styles from "./button.module.scss";
import type { ComponentProps } from "react";

const buttonVariants = cva(styles.root, {
  variants: {
    variant: {
      default: styles.default,
      destructive: styles.destructive,
      outline: styles.outline,
      secondary: styles.secondary,
      ghost: styles.ghost,
      link: styles.link,
    },
    size: {
      default: styles.sizeDefault,
      sm: styles.sm,
      lg: styles.lg,
      icon: styles.icon,
      "icon-sm": styles.iconSm,
      "icon-lg": styles.iconLg,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({ className, variant, size, type = "button", asChild = false, ...props }: ButtonProps): React.ReactNode => {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...(!asChild && { type })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
