"use client";

import type {
  IncidentPriority,
  IncidentStatus,
} from "@/generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import {
  MAP_PRIORITY_FILTERS,
  MAP_STATUS_FILTERS,
} from "../../constants/incident-map-style";
import styles from "./map-filters.module.scss";

const ALL_FILTER_VALUE = "all";

interface MapFiltersProps {
  priority: IncidentPriority | null;
  status: IncidentStatus | null;
  onPriorityChange: (priority: IncidentPriority | null) => void;
  onStatusChange: (status: IncidentStatus | null) => void;
}

const MapFilters = ({ priority, status, onPriorityChange, onStatusChange }: MapFiltersProps) => {

  const tFilters = useTranslations("map.filters");
  const tEnums = useTranslations("common.enums")

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <span className={styles.label}>{tFilters("status")}</span>
        <Select
          value={status ?? ALL_FILTER_VALUE}
          onValueChange={(value) => {
            onStatusChange(
              value === ALL_FILTER_VALUE ? null : (value as IncidentStatus),
            );
          }}
        >
          <SelectTrigger size="sm" className={styles.trigger}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL_FILTER_VALUE}>{tFilters("all")}</SelectItem>
            {MAP_STATUS_FILTERS.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {tEnums(`incident_status.${statusOption}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>{tFilters("priority")}</span>
        <Select
          value={priority ?? ALL_FILTER_VALUE}
          onValueChange={(value) => {
            onPriorityChange(
              value === ALL_FILTER_VALUE ? null : (value as IncidentPriority),
            );
          }}
        >
          <SelectTrigger size="sm" className={styles.trigger}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL_FILTER_VALUE}>{tFilters("all")}</SelectItem>
            {MAP_PRIORITY_FILTERS.map((priorityOption) => (
              <SelectItem key={priorityOption} value={priorityOption}>
                {tEnums(`incident_priority.${priorityOption}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export { MapFilters };
