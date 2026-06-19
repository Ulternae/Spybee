"use client";

import * as React from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils/cn";
import styles from "./analytics-charts.module.scss";

import type {
  IncidenceCategoryDatum,
  IncidenceTreemapDatum,
  IncidenceTrendDatum,
  TrendPeriod,
} from "./types";

type TooltipPayload = {
  name?: string;
  value?: number | string;
  dataKey?: string;
  color?: string;
  payload?: Record<string, unknown>;
};

type TooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayload[];
};

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function ChartCard({
  title,
  subtitle,
  action,
  className,
  children,
}: ChartCardProps) {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <section className={cn(styles.card, className)}>
      {hasHeader ? (
        <header className={styles.cardHeader}>
          <div>
            {title ? <h3 className={styles.cardTitle}>{title}</h3> : null}
            {subtitle ? <p className={styles.cardSubtitle}>{subtitle}</p> : null}
          </div>

          {action ? <div className={styles.cardAction}>{action}</div> : null}
        </header>
      ) : null}

      <div className={styles.cardBody}>{children}</div>
    </section>
  );
}

function DefaultTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      {label ? <p className={styles.tooltipTitle}>{label}</p> : null}

      <div className={styles.tooltipList}>
        {payload.map((item, idx) => (
          <div
            key={`${item.dataKey}-${item.name}-${idx}`}
            className={styles.tooltipRow}
          >
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.tooltipName}>{item.name}</span>
            <strong className={styles.tooltipValue}>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

interface IncidenceRadarChartProps {
  data: IncidenceCategoryDatum[];
  title?: string;
  subtitle?: string;
  className?: string;
  seriesName?: string;
}

export function IncidenceRadarChart({
  data,
  title,
  subtitle,
  className,
  seriesName = "Incidents",
}: IncidenceRadarChartProps) {
  const maxValue = Math.max(4, ...data.map((item) => item.total));

  return (
    <ChartCard title={title} subtitle={subtitle} className={className}>
      <div className={styles.radarChart}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="var(--border)" />

            <PolarAngleAxis
              dataKey="category"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, maxValue]}
              tickCount={5}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
            />

            <Tooltip content={<DefaultTooltip />} />

            <Radar
              name={seriesName}
              dataKey="total"
              stroke="var(--chart-5)"
              fill="var(--chart-5)"
              fillOpacity={0.28}
              strokeWidth={2}
              dot
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

type TreemapContentProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  index?: number;
  payload?: IncidenceTreemapDatum;
};

const fallbackTreemapColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function TreemapTile(props: TreemapContentProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name,
    value,
    index = 0,
    payload,
  } = props;

  const fill =
    payload?.color ?? fallbackTreemapColors[index % fallbackTreemapColors.length];

  const canShowLabel = width > 72 && height > 42;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={7}
        ry={7}
        fill={fill}
        stroke="var(--card)"
        strokeWidth={2}
      />

      {canShowLabel ? (
        <foreignObject x={x} y={y} width={width} height={height}>
          <div className={styles.treemapTile}>
            <span className={styles.treemapLabel}>{name}</span>
            {typeof value !== "undefined" ? (
              <strong className={styles.treemapValue}>{value}</strong>
            ) : null}
          </div>
        </foreignObject>
      ) : null}
    </g>
  );
}

interface IncidenceTreemapChartProps {
  data: IncidenceTreemapDatum[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function IncidenceTreemapChart({
  data,
  title,
  subtitle,
  className,
}: IncidenceTreemapChartProps) {
  return (
    <ChartCard title={title} subtitle={subtitle} className={className}>
      <div className={styles.treemapChart}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            aspectRatio={16 / 9}
            stroke="var(--card)"
            content={<TreemapTile />}
            isAnimationActive={false}
          >
            <Tooltip content={<DefaultTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

interface IncidenceTrendChartProps {
  data: IncidenceTrendDatum[];
  title?: string;
  subtitle?: string;
  className?: string;
  seriesLabels?: {
    backlog?: string;
    created?: string;
    closed?: string;
  };
}

export function IncidenceTrendChart({
  data,
  title,
  subtitle,
  className,
  seriesLabels,
}: IncidenceTrendChartProps) {
  const backlogLabel = seriesLabels?.backlog ?? "Accumulated backlog";
  const createdLabel = seriesLabels?.created ?? "Created";
  const closedLabel = seriesLabels?.closed ?? "Closed";

  return (
    <ChartCard title={title} subtitle={subtitle} className={className}>
      <div className={styles.trendChart}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: -16,
            }}
          >
            <defs>
              <linearGradient id="backlogFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.18}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.03}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />

            <Tooltip content={<DefaultTooltip />} />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                paddingTop: 16,
                color: "var(--muted-foreground)",
                fontSize: 13,
              }}
            />

            <Area
              name={backlogLabel}
              type="monotone"
              dataKey="backlog"
              fill="url(#backlogFill)"
              stroke="none"
              activeDot={false}
              legendType="none"
            />

            <Line
              name={backlogLabel}
              type="monotone"
              dataKey="backlog"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "var(--chart-2)",
                stroke: "var(--chart-2)",
              }}
              activeDot={{
                r: 5,
                fill: "var(--chart-2)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
            />

            <Bar
              name={createdLabel}
              dataKey="created"
              fill="var(--chart-3)"
              radius={[6, 6, 0, 0]}
              barSize={14}
            />

            <Bar
              name={closedLabel}
              dataKey="closed"
              fill="var(--chart-4)"
              radius={[6, 6, 0, 0]}
              barSize={14}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}