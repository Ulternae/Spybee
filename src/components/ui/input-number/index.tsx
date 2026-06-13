"use client";

import { MinaMinus, MinaPlus } from "@zcorvus/icons-react";
import {
  Button as AriaButton,
  Group,
  Input as AriaInput,
  NumberField,
  type NumberFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils/cn";
import styles from "./input-number.module.scss";

interface InputNumberProps extends Omit<NumberFieldProps, "className"> {
  className?: string;
}

function InputNumber({ className, ...props }: InputNumberProps) {
  return (
    <NumberField
      data-slot="input-number"
      className={cn(styles.field, className)}
      {...props}
    >
      <Group className={styles.group}>
        <AriaButton slot="decrement" className={styles.button}>
          <MinaMinus />
          <span className={styles.srOnly}>Decrement</span>
        </AriaButton>
        <AriaInput className={styles.input} />
        <AriaButton slot="increment" className={styles.button}>
          <MinaPlus />
          <span className={styles.srOnly}>Increment</span>
        </AriaButton>
      </Group>
    </NumberField>
  );
}

export { InputNumber };
export type { InputNumberProps };
