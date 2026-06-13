"use client";

import {
  MinaCheck,
  MinaDanger,
  MinaInfo,
  MinaSpinner,
  MinaX,
} from "@zcorvus/icons-react";
import {
  Toaster as Sonner,
  type ToasterProps,
} from "sonner";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./sonner.module.scss";

function Toaster({
  className,
  icons,
  style,
  toastOptions,
  ...props
}: ToasterProps) {
  return (
    <Sonner
      className={cn(styles.toaster, className)}
      icons={{
        success: <MinaCheck />,
        info: <MinaInfo />,
        warning: <MinaDanger />,
        error: <MinaX />,
        loading: <MinaSpinner className={styles.spinner} />,
        ...icons,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          ...style,
        } as CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          description: cn(
            styles.description,
            toastOptions?.classNames?.description,
          ),
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
