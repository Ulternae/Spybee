import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./textarea.module.scss";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(styles.textarea, className)}
      {...props}
    />
  );
}

export { Textarea };
