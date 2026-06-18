"use client";

import { useMemo, useState } from "react";
import { IncidentPriority, IncidentStatus } from "@/generated/prisma/enums";
import { filterIncidents } from "../../lib/filter-incidents";
import { MapFilters } from "../map-filters";
import { MapboxMap } from "../mapbox-map";
import type { ActiveProjectMap } from "../../queries/get-active-project-map";
import styles from "./map-panel.module.scss";

interface MapPanelProps {
  data: ActiveProjectMap;
  locale: string;
}

const MapPanel = ({ data, locale }: MapPanelProps) => {

  const [statusFilter, setStatusFilter] = useState<IncidentStatus | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | null>(null);
  const filteredIncidents = useMemo(() => {
    return filterIncidents(data.incidents, {
      priority: priorityFilter,
      status: statusFilter,
    });
  }, [data.incidents, priorityFilter, statusFilter]);

  return (
    <main className={styles.root}>
      <section className={styles.container}>
        <MapFilters
          priority={priorityFilter}
          status={statusFilter}
          onPriorityChange={setPriorityFilter}
          onStatusChange={setStatusFilter}
        />
        <MapboxMap
          incidents={filteredIncidents}
          locale={locale}
        />
      </section>
    </main>
  );
};

export { MapPanel };
