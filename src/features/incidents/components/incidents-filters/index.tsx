"use client";

import { IncidentPriority, IncidentStatus } from "@/generated/prisma/enums";
import { useLocale, useTranslations } from "next-intl";
import { useAppStore } from "@/store/app/app.provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IncidentsOverview } from "../../queries/get-incidents-overview";
import type {
  IncidentDateRangeKey,
  IncidentsFiltersValue,
} from "../../types/incidents-filters.types";
import styles from "./incidents-filters.module.scss";

const ALL_FILTER_VALUE = "all";

interface IncidentsFiltersProps {
  options: IncidentsOverview["filters"]["options"];
}

const IncidentsFilters = ({ options }: IncidentsFiltersProps) => {
  const locale = useLocale();
  const t = useTranslations("incidents.filters");
  const tCommon = useTranslations("common");
  const filters = useAppStore((state) => state.incidentsDashboardFilters);
  const setFilters = useAppStore((state) => state.setIncidentsDashboardFilters);
  const categoryNameKey = locale === "en" ? "nameEn" : "nameEs";
  const updateFilters = (nextFilters: Partial<IncidentsFiltersValue>) => {
    setFilters({
      filters: {
        ...filters,
        ...nextFilters,
      },
    });
  };

  return (
    <section className={styles.root} aria-label={t("title")}>
      <Select
        value={filters.dateRange}
        onValueChange={(dateRange) =>
          updateFilters({
            dateRange: dateRange as IncidentDateRangeKey,
          })
        }
      >
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder={t("date_range")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last_year">{t("ranges.last_year")}</SelectItem>
          <SelectItem value="last_7_days">{t("ranges.last_7_days")}</SelectItem>
          <SelectItem value="last_30_days">{t("ranges.last_30_days")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? ALL_FILTER_VALUE}
        onValueChange={(status) =>
          updateFilters({
            status:
              status === ALL_FILTER_VALUE ? null : (status as IncidentStatus),
          })
        }
      >
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder={t("status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>{t("all_statuses")}</SelectItem>
          {Object.values(IncidentStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {tCommon(`enums.incident_status.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? ALL_FILTER_VALUE}
        onValueChange={(priority) =>
          updateFilters({
            priority:
              priority === ALL_FILTER_VALUE
                ? null
                : (priority as IncidentPriority),
          })
        }
      >
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder={t("priority")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>{t("all_priorities")}</SelectItem>
          {Object.values(IncidentPriority).map((priority) => (
            <SelectItem key={priority} value={priority}>
              {tCommon(`enums.incident_priority.${priority}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.categoryId ?? ALL_FILTER_VALUE}
        onValueChange={(categoryId) =>
          updateFilters({
            categoryId: categoryId === ALL_FILTER_VALUE ? null : categoryId,
          })
        }
      >
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder={t("category")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>{t("all_categories")}</SelectItem>
          {options.categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category[categoryNameKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.assigneeId ?? ALL_FILTER_VALUE}
        onValueChange={(assigneeId) =>
          updateFilters({
            assigneeId: assigneeId === ALL_FILTER_VALUE ? null : assigneeId,
          })
        }
      >
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder={t("assignee")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>{t("all_assignees")}</SelectItem>
          {options.members.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
};

export { IncidentsFilters };
export type { IncidentsFiltersProps };
