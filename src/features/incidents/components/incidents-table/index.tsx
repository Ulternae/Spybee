"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ServerDataTable } from "@/components/ui/server-data-table";
import { getIncidentsTableAction } from "../../actions/get-incidents-table/get-incidents-table.action";
import type { IncidentsTableData } from "../../queries/get-incidents-table";
import type {
  IncidentsRiskIndicator,
  RiskIndicatorKey,
} from "../../queries/get-incidents-overview";
import { RiskIndicators } from "../risk-indicators";
import { useIncidentsTableColumns } from "./datatable/incidents-table.columns";
import styles from "./incidents-table.module.scss";
import { MinaTable } from "@zcorvus/icons-react";

interface IncidentsTableProps {
  data: IncidentsTableData;
  riskIndicators: IncidentsRiskIndicator[];
}

const IncidentsTable = ({ data, riskIndicators }: IncidentsTableProps) => {
  const t = useTranslations("incidents.table");
  const [tableData, setTableData] = useState(data);
  const [selectedRiskIndicator, setSelectedRiskIndicator] =
    useState<RiskIndicatorKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const requestIdRef = useRef(0);
  const columns = useIncidentsTableColumns({
    canUpdateIncidents: tableData.access.canUpdateIncidents,
  });
  const { totalItems } = tableData.pagination;

  const fetchTablePage = (page: number, riskIndicator: RiskIndicatorKey | null) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);

    void getIncidentsTableAction({
      page,
      riskIndicator,
    })
      .then((nextData) => {
        if (requestIdRef.current !== requestId) {
          return;
        }

        startTransition(() => {
          setTableData(nextData);
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      });
  };

  const handlePageChange = (page: number) => {
    fetchTablePage(page, selectedRiskIndicator);
  };

  const handleRiskIndicatorChange = (riskIndicator: RiskIndicatorKey | null) => {
    setSelectedRiskIndicator(riskIndicator);
    fetchTablePage(1, riskIndicator);
  };

  return (
    <section className={styles.root}>
      <RiskIndicators
        indicators={riskIndicators}
        selectedIndicator={selectedRiskIndicator}
        onIndicatorChange={handleRiskIndicatorChange}
      />

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
          data={tableData.items}
          pagination={tableData.pagination}
          isLoading={isLoading || isPending}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export { IncidentsTable };
export type { IncidentsTableProps };
