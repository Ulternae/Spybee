"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import styles from "./server-data-table.module.scss";
import {
  MinaChevronDoubleLeft,
  MinaChevronDoubleRight,
  MinaChevronLeft,
  MinaChevronRight,
} from "@zcorvus/icons-react";

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
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  stickyEndColumnId?: string;
}

const ServerDataTable = <TData, TValue>({
  columns,
  data,
  pagination,
  isLoading = false,
  onPageChange,
  stickyEndColumnId = "actions",
}: ServerDataTableProps<TData, TValue>) => {
  const tTable = useTranslations("common.table");

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
    <div className={styles.root} data-loading={isLoading || undefined}>
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
          aria-label={tTable("first_page")}
          disabled={isLoading || isPreviousDisabled}
          onClick={() => onPageChange(1)}
        >
          <MinaChevronDoubleLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label={tTable("previous_page")}
          disabled={isLoading || isPreviousDisabled}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <MinaChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label={tTable("next_page")}
          disabled={isLoading || isNextDisabled}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <MinaChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label={tTable("last_page")}
          disabled={isLoading || isNextDisabled}
          onClick={() => onPageChange(pagination.totalPages)}
        >
          <MinaChevronDoubleRight />
        </Button>
      </footer>
    </div>
  );
};

export { ServerDataTable };
export type { ServerDataTablePagination, ServerDataTableProps };
