import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./breadcrumb.module.scss";

function Breadcrumb({ ...props }: ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(styles.list, className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(styles.item, className)}
      {...props}
    />
  );
}

interface BreadcrumbLinkProps extends ComponentProps<"a"> {
  asChild?: boolean;
}

function BreadcrumbLink({
  asChild = false,
  className,
  ...props
}: BreadcrumbLinkProps) {
  const Component = asChild ? Slot : "a";

  return (
    <Component
      data-slot="breadcrumb-link"
      className={cn(styles.link, className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn(styles.page, className)}
      {...props}
    />
  );
}

interface BreadcrumbSeparatorProps extends ComponentProps<"li"> {
  children?: ReactNode;
}

function BreadcrumbSeparator({
  children = "/",
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      aria-hidden="true"
      role="presentation"
      data-slot="breadcrumb-separator"
      className={cn(styles.separator, className)}
      {...props}
    >
      {children}
    </li>
  );
}

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
