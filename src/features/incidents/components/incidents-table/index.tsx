"use client";

import { useTranslations } from "next-intl";
import { ServerDataTable } from "@/components/ui/server-data-table";
import type { IncidentsTableData } from "../../queries/get-incidents-table";
import { useIncidentsTableColumns } from "./datatable/incidents-table.columns";
import styles from "./incidents-table.module.scss";
import { MinaTable } from "@zcorvus/icons-react";

interface IncidentsTableProps {
  data: IncidentsTableData;
}

const IncidentsTable = ({ data }: IncidentsTableProps) => {
  const t = useTranslations("incidents.table");
  const columns = useIncidentsTableColumns({
    canUpdateIncidents: data.access.canUpdateIncidents,
  });
  const { totalItems } = data.pagination;

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <MinaTable className={styles.headerIcon} />
        <div className={styles.headerContent}>
          <h2>{t("title")}</h2>
          <p>{t("description", { count: totalItems })}</p>
        </div>
      </header>

      <div className={styles.table}>
        <ServerDataTable
          columns={columns}
          data={data.items}
          pagination={data.pagination}
          pageParamName="incidentsPage"
          persistentSearchParams={{ tab: "incidents" }}
        />
      </div>
    </section>
  );
};

export { IncidentsTable };
export type { IncidentsTableProps };
