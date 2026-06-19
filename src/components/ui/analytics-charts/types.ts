export type IncidenceCategoryDatum = {
  category: string;
  total: number;
};

export type IncidenceTreemapDatum = {
  name: string;
  value?: number;
  color?: string;
  children?: IncidenceTreemapDatum[];
};

export type TrendPeriod = "day" | "week" | "month";

export type IncidenceTrendDatum = {
  label: string;
  backlog: number;
  created: number;
  closed: number;
};