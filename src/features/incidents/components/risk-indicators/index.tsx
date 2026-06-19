"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type {
  IncidentsRiskIndicator,
  RiskIndicatorKey,
} from "../../queries/get-incidents-overview";
import styles from "./risk-indicators.module.scss";
import { MinaDangerTriangle } from "@zcorvus/icons-react";

interface RiskIndicatorsProps {
  indicators: IncidentsRiskIndicator[];
  selectedIndicator: RiskIndicatorKey | null;
  onIndicatorChange: (indicator: RiskIndicatorKey | null) => void;
}

const RiskIndicators = ({ indicators, selectedIndicator, onIndicatorChange }: RiskIndicatorsProps) => {
  const t = useTranslations("incidents.risk");

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
                onIndicatorChange(isSelected ? null : indicator.key)
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
