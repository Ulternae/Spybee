"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ServerDataTable } from "@/components/ui/server-data-table";
import { useAppStore } from "@/store/app/app.provider";
import { getIncidentsTableAction } from "../../actions/get-incidents-table/get-incidents-table.action";
import type { IncidentFormOptions } from "../../queries/get-incident-form-options";
import type { IncidentsTableData } from "../../queries/get-incidents-table";
import type {
  IncidentsRiskIndicator,
} from "../../queries/get-incidents-overview";
import { RiskIndicators } from "../risk-indicators";
import type {
  IncidentsFiltersValue,
  RiskIndicatorKey,
} from "../../types/incidents-filters.types";
import { useIncidentsTableColumns } from "./datatable/incidents-table.columns";
import styles from "./incidents-table.module.scss";
import { MinaTable } from "@zcorvus/icons-react";

interface IncidentsTableProps {
  data: IncidentsTableData;
  options: IncidentFormOptions;
  riskIndicators: IncidentsRiskIndicator[];
}

const IncidentsTable = ({ data, options, riskIndicators }: IncidentsTableProps) => {
  const t = useTranslations("incidents.table");
  const [tableData, setTableData] = useState(data);
  const filters = useAppStore((state) => state.incidentsDashboardFilters);
  const selectedRiskIndicator = useAppStore(
    (state) => state.incidentsDashboardRiskIndicator,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const requestIdRef = useRef(0);
  const didMountRef = useRef(false);
  const { totalItems } = tableData.pagination;

  const fetchTablePage = useCallback(
    (
      page: number,
      nextFilters: IncidentsFiltersValue,
      riskIndicator: RiskIndicatorKey | null,
    ) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);

      void getIncidentsTableAction({
        page,
        filters: nextFilters,
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
    },
    [startTransition],
  );

  const handlePageChange = (page: number) => {
    fetchTablePage(page, filters, selectedRiskIndicator);
  };

  const handleEditSuccess = () => {
    fetchTablePage(tableData.pagination.page, filters, selectedRiskIndicator);
  };

  const columns = useIncidentsTableColumns({
    canUpdateIncidents: tableData.access.canUpdateIncidents,
    options,
    onEditSuccess: handleEditSuccess,
  });

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    fetchTablePage(1, filters, selectedRiskIndicator);
  }, [fetchTablePage, filters, selectedRiskIndicator]);

  return (
    <section className={styles.root}>

      <RiskIndicators
        indicators={riskIndicators}
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
