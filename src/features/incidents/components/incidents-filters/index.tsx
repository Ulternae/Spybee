"use client";

import { IncidentPriority, IncidentStatus } from "@/generated/prisma/enums";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  IncidentDateRangeKey,
  IncidentsOverview,
} from "../../queries/get-incidents-overview";
import styles from "./incidents-filters.module.scss";

const ALL_FILTER_VALUE = "all";

type IncidentsFiltersValue = {
  dateRange: IncidentDateRangeKey;
  status: IncidentStatus | null;
  priority: IncidentPriority | null;
  categoryId: string | null;
  assigneeId: string | null;
};

interface IncidentsFiltersProps {
  value: IncidentsFiltersValue;
  options: IncidentsOverview["filters"]["options"];
  onChange: (value: IncidentsFiltersValue) => void;
}

const IncidentsFilters = ({ value, options, onChange }: IncidentsFiltersProps) => {
  const locale = useLocale();
  const t = useTranslations("incidents.filters");
  const tCommon = useTranslations("common");
  const categoryNameKey = locale === "en" ? "nameEn" : "nameEs";

  return (
    <section className={styles.root} aria-label={t("title")}>
      <Select
        value={value.dateRange}
        onValueChange={(dateRange) =>
          onChange({
            ...value,
            dateRange: dateRange as IncidentDateRangeKey,
          })
        }
      >
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder={t("date_range")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last_7_days">{t("ranges.last_7_days")}</SelectItem>
          <SelectItem value="last_30_days">{t("ranges.last_30_days")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.status ?? ALL_FILTER_VALUE}
        onValueChange={(status) =>
          onChange({
            ...value,
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
        value={value.priority ?? ALL_FILTER_VALUE}
        onValueChange={(priority) =>
          onChange({
            ...value,
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
        value={value.categoryId ?? ALL_FILTER_VALUE}
        onValueChange={(categoryId) =>
          onChange({
            ...value,
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
        value={value.assigneeId ?? ALL_FILTER_VALUE}
        onValueChange={(assigneeId) =>
          onChange({
            ...value,
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
export type { IncidentsFiltersProps, IncidentsFiltersValue };
