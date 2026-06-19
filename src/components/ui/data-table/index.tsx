"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  MinaChevronDoubleLeft,
  MinaChevronDoubleRight,
  MinaChevronLeft,
  MinaChevronRight,
} from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils/cn";
import styles from "./data-table.module.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

type SearchableColumnKey<TData> = TData extends object
  ? {
    [TKey in Extract<keyof TData, string>]: NonNullable<TData[TKey]> extends
    | Date
    | ((...args: never[]) => unknown)
    | readonly unknown[]
    ? TKey
    : NonNullable<TData[TKey]> extends object
    ? TKey | `${TKey}.${SearchableColumnKey<NonNullable<TData[TKey]>>}`
    : TKey;
  }[Extract<keyof TData, string>]
  : never;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableColumns: SearchableColumnKey<TData>[];
  stickyEndColumnId?: string;
  isLoading?: boolean;
  pageSize?: number;
}

const getValueByPath = <TData,>(
  data: TData,
  path: SearchableColumnKey<TData>,
) => {
  return String(path)
    .split(".")
    .reduce<unknown>((value, key) => {
      if (value == null || typeof value !== "object") {
        return undefined;
      }

      return (value as Record<string, unknown>)[key];
    }, data);
};

const DataTable = <TData, TValue>({
  columns,
  data,
  searchableColumns,
  stickyEndColumnId = "actions",
  isLoading = false,
  pageSize = 10,
}: DataTableProps<TData, TValue>) => {
  const tTable = useTranslations("common.table");
  const tFields = useTranslations("common.fields");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const globalFilterFn = useMemo<FilterFn<TData>>(() => {
    return (row: Row<TData>, _columnId: string, filterValue: unknown) => {
      const search = String(filterValue ?? "")
        .trim()
        .toLowerCase();

      if (!search) return true;

      return searchableColumns.some((columnKey) => {
        const originalValue = getValueByPath(row.original, columnKey);

        if (originalValue == null) return false;

        const normalizedValue = String(originalValue).toLowerCase();

        return normalizedValue.includes(search);
      });
    };
  }, [searchableColumns]);

  const getStickyEndColumnClassName = (columnId: string, isHeader = false) => {
    if (columnId !== stickyEndColumnId) {
      return undefined;
    }

    return cn(
      styles.stickyEndColumn,
      isHeader ? styles.stickyEndHeader : styles.stickyEndCell,
    );
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
  });

  const totalPages = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(table.getState().pagination.pageIndex + 1, totalPages);
  const isPreviousDisabled = !table.getCanPreviousPage();
  const isNextDisabled = !table.getCanNextPage();

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Input
          placeholder={tTable("filter_results")}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          containerClassName={styles.searchInput}
        />
      </div>

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
                      tFields.has(header.column.columnDef.header as string)
                        ? tFields(header.column.columnDef.header as string)
                        : header.column.columnDef.header,
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
            page: currentPage,
            totalPages,
          })}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={tTable("first_page")}
          disabled={isLoading || isPreviousDisabled}
          onClick={() => table.setPageIndex(0)}
        >
          <MinaChevronDoubleLeft />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={tTable("previous_page")}
          disabled={isLoading || isPreviousDisabled}
          onClick={() => table.previousPage()}
        >
          <MinaChevronLeft />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={tTable("next_page")}
          disabled={isLoading || isNextDisabled}
          onClick={() => table.nextPage()}
        >
          <MinaChevronRight />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={tTable("last_page")}
          disabled={isLoading || isNextDisabled}
          onClick={() => table.setPageIndex(totalPages - 1)}
        >
          <MinaChevronDoubleRight />
        </Button>
      </footer>
    </div>
  );
};

export { DataTable };