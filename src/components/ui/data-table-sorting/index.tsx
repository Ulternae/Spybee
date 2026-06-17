"use client";

import { Column } from "@tanstack/react-table";
import { MinaArrowUpDown } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import styles from "./data-table-sorting.module.scss";

interface DatatableSortingProps<T> {
  name: string;
  column: Column<T, unknown>;
  className?: string;
}

const DatatableSorting = <T,>({
  name,
  column,
  className,
}: DatatableSortingProps<T>) => {
  const t = useTranslations("common.fields");

  return (
    <Button
      variant="ghost"
      className={cn(styles.button, className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {t.has(name) ? t(name) : name}
      <MinaArrowUpDown className={styles.icon} />
    </Button>
  );
};

export { DatatableSorting };