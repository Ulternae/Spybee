"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import styles from "./server-data-table.module.scss";
import { MinaChevronLeft, MinaChevronRight, MinaChevronDoubleLeft, MinaChevronDoubleRight } from "@zcorvus/icons-react";

type ServerDataTablePagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

interface ServerDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: ServerDataTablePagination;
  pageParamName?: string;
  stickyEndColumnId?: string;
  persistentSearchParams?: Record<string, string>;
}

const ServerDataTable = <TData, TValue>({
  columns,
  data,
  pagination,
  pageParamName = "page",
  stickyEndColumnId = "actions",
  persistentSearchParams,
}: ServerDataTableProps<TData, TValue>) => {
  const tTable = useTranslations("common.table");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
  });

  const createPageHref = useMemo(() => {
    return (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page <= 1) {
        params.delete(pageParamName);
      } else {
        params.set(pageParamName, String(page));
      }

      Object.entries(persistentSearchParams ?? {}).forEach(([key, value]) => {
        params.set(key, value);
      });

      const query = params.toString();

      return query ? `${pathname}?${query}` : pathname;
    };
  }, [pageParamName, pathname, persistentSearchParams, searchParams]);

  const getStickyEndColumnClassName = (columnId: string, isHeader = false) => {
    if (columnId !== stickyEndColumnId) {
      return undefined;
    }

    return cn(
      styles.stickyEndColumn,
      isHeader ? styles.stickyEndHeader : styles.stickyEndCell,
    );
  };

  const isPreviousDisabled = pagination.page <= 1;
  const isNextDisabled = pagination.page >= pagination.totalPages;

  return (
    <div className={styles.root}>
      <Table style={{ minWidth: table.getTotalSize() }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    styles.head,
                    getStickyEndColumnClassName(header.column.id, true),
                  )}
                  style={{ minWidth: header.column.columnDef.minSize }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={styles.row}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={getStickyEndColumnClassName(cell.column.id)}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.columnDef.minSize,
                      maxWidth: cell.column.columnDef.maxSize,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className={styles.emptyCell}>
                {tTable("no_results")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <footer className={styles.pagination}>
        <span className={styles.paginationInfo}>
          {tTable("page", {
            page: pagination.page,
            totalPages: pagination.totalPages,
          })}
        </span>
        <Button
          variant="outline"
          size="sm"
        >
          <MinaChevronDoubleLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className={cn(isPreviousDisabled && styles.disabledLink)}
          aria-disabled={isPreviousDisabled}
        >
          <Link href={createPageHref(pagination.page - 1)}>
            <MinaChevronLeft />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className={cn(isNextDisabled && styles.disabledLink)}
          aria-disabled={isNextDisabled}
        >
          <Link href={createPageHref(pagination.page + 1)}>
            <MinaChevronRight />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          <MinaChevronDoubleRight />
        </Button>
      </footer>
    </div>
  );
};

export { ServerDataTable };
export type { ServerDataTablePagination, ServerDataTableProps };
