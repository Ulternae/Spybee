"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app/app.provider";
import type {
  IncidentsRiskIndicator,
} from "../../queries/get-incidents-overview";
import styles from "./risk-indicators.module.scss";
import { MinaDangerTriangle } from "@zcorvus/icons-react";

interface RiskIndicatorsProps {
  indicators: IncidentsRiskIndicator[];
}

const RiskIndicators = ({ indicators }: RiskIndicatorsProps) => {
  const t = useTranslations("incidents.risk");
  const selectedIndicator = useAppStore((state) => state.incidentsDashboardRiskIndicator);
  const setSelectedIndicator = useAppStore((state) => state.setIncidentsDashboardRiskIndicator);

  return (
    <section className={styles.root}>

      <div className={styles.list}>
        {indicators.map((indicator) => {
          const isSelected = selectedIndicator === indicator.key;

          return (
            <Button
              key={indicator.key}
              type="button"
              variant="outline"
              className={styles.item}
              data-tone={indicator.tone}
              data-selected={isSelected || undefined}
              onClick={() =>
                setSelectedIndicator({
                  riskIndicator: isSelected ? null : indicator.key,
                })
              }
            >
              <span>{t(`items.${indicator.key}`)}</span>
              <strong>{indicator.count}</strong>
            </Button>
          );
        })}
      </div>

      <div className={styles.notice}>
        <p>{t("description")}</p>
        <MinaDangerTriangle className={styles.noticeIcon} />
      </div>
    </section>
  );
};

export { RiskIndicators };
export type { RiskIndicatorsProps };
