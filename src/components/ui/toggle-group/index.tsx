"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";
import {
  createContext,
  useContext,
  type ComponentProps,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils/cn";
import { toggleVariants } from "@/components/ui/toggle";
import styles from "./toggle-group.module.scss";

type ToggleGroupVariants = VariantProps<typeof toggleVariants> & {
  spacing?: number;
};

const ToggleGroupContext = createContext<ToggleGroupVariants>({
  size: "default",
  variant: "default",
  spacing: 0,
});

type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> &
  ToggleGroupVariants;

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-spacing={spacing}
      style={{ "--toggle-group-gap": spacing } as CSSProperties}
      className={cn(styles.group, className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

type ToggleGroupItemProps = ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>;

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  const resolvedVariant = context.variant ?? variant;
  const resolvedSize = context.size ?? size;

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        styles.item,
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
