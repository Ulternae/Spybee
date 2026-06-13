"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import styles from "./input-group.module.scss";

function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(styles.group, className)}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(styles.addon, {
  variants: {
    align: {
      "inline-start": styles.inlineStart,
      "inline-end": styles.inlineEnd,
      "block-start": styles.blockStart,
      "block-end": styles.blockEnd,
    },
  },
  defaultVariants: {
    align: "inline-start",
  },
});

interface InputGroupAddonProps
  extends ComponentProps<"div">,
    VariantProps<typeof inputGroupAddonVariants> {}

function InputGroupAddon({
  className,
  align,
  onClick,
  ...props
}: InputGroupAddonProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || (event.target as HTMLElement).closest("button")) {
      return;
    }
    event.currentTarget.parentElement
      ?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")
      ?.focus();
  };

  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align ?? "inline-start"}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={handleClick}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(styles.button, {
  variants: {
    size: {
      xs: styles.buttonXs,
      sm: styles.buttonSm,
      "icon-xs": styles.buttonIconXs,
      "icon-sm": styles.buttonIconSm,
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

interface InputGroupButtonProps
  extends Omit<ComponentProps<typeof Button>, "size">,
    VariantProps<typeof inputGroupButtonVariants> {}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: InputGroupButtonProps) {
  const buttonSize = size === "sm" ? "sm" : size === "icon-sm" ? "icon-sm" : undefined;

  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size={buttonSize}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(styles.text, className)}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-control"
      containerClassName={cn(styles.controlContainer, containerClassName)}
      className={cn(styles.control, className)}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(styles.textarea, className)}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
