"use client";

import { UserAvatar } from "@/components/common/user-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import styles from "./performance-card.module.scss";
import { MinaRadio, MinaWrench, MinaBox } from "@zcorvus/icons-react";

type PerformanceCardTone = "chart-3" | "chart-4" | "chart-5";

type PerformanceCardItem = {
  id: string;
  name: string;
  image: string | null;
  value: number;
  secondaryValue?: number;
  secondaryTone?: "warning" | "danger";
  meta?: string;
};

interface PerformanceCardProps {
  title: string;
  description: string;
  emptyMessage: string;
  items: PerformanceCardItem[];
  tone: PerformanceCardTone;
  valueLabel: (item: PerformanceCardItem) => string;
}

const ICONS = {
  "chart-3": <MinaWrench />,
  "chart-4": <MinaRadio />,
  "chart-5": <MinaBox />,
} as const

const getMaxValue = (items: PerformanceCardItem[]) => {
  return Math.max(...items.map((item) => item.value), 1);
};

const PerformanceCard = ({ title, description, emptyMessage, items, tone, valueLabel }: PerformanceCardProps) => {
  const maxValue = getMaxValue(items);

  return (
    <Card className={styles.card} data-tone={tone}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.cardHeaderIcon}>
          {ICONS[tone]}
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        {items.length === 0 ? (
          <p className={styles.empty}>{emptyMessage}</p>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <UserAvatar
                  name={item.name}
                  image={item.image}
                  className={styles.avatar}
                />
                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <span>{item.name}</span>
                    <strong>{valueLabel(item)}</strong>
                  </div>
                  <div className={styles.progressTrack}>
                    <span
                      className={styles.progressBar}
                      style={{
                        inlineSize: `${Math.max(
                          8,
                          (item.value / maxValue) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                  {item.meta && <p>{item.meta}</p>}
                </div>
                {typeof item.secondaryValue === "number" && (
                  <strong
                    className={styles.secondaryValue}
                    data-tone={item.secondaryTone}
                  >
                    {item.secondaryValue}
                  </strong>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export { PerformanceCard };
export type { PerformanceCardItem, PerformanceCardProps, PerformanceCardTone };
