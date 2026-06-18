import { IncidentPriority, IncidentStatus } from "@/generated/prisma/enums";

const INCIDENT_STATUS_COLORS = {
  [IncidentStatus.OPEN]: "#EF4444",
  [IncidentStatus.ON_PAUSE]: "#F59E0B",
  [IncidentStatus.CLOSED]: "#10B981",
} as const;

const INCIDENT_STATUS_COLORS_PASTEL = {
  [IncidentStatus.OPEN]: "#FEE2E2",
  [IncidentStatus.ON_PAUSE]: "#FEF3C7",
  [IncidentStatus.CLOSED]: "#D1FAE5",
} as const;

const INCIDENT_STATUS_ICON_ASSETS = {
  [IncidentStatus.OPEN]: {
    id: "incident-status-open",
    path: "/map/incidents/status-open.png",
  },
  [IncidentStatus.ON_PAUSE]: {
    id: "incident-status-on-pause",
    path: "/map/incidents/status-on-open.png",
  },
  [IncidentStatus.CLOSED]: {
    id: "incident-status-closed",
    path: "/map/incidents/status-closed.png",
  },
} as const;

const MAP_STATUS_FILTERS = [
  IncidentStatus.OPEN,
  IncidentStatus.ON_PAUSE,
  IncidentStatus.CLOSED,
] as const;

const MAP_PRIORITY_FILTERS = [
  IncidentPriority.LOW,
  IncidentPriority.MEDIUM,
  IncidentPriority.HIGH,
] as const;

export {
  INCIDENT_STATUS_COLORS,
  INCIDENT_STATUS_ICON_ASSETS,
  MAP_PRIORITY_FILTERS,
  MAP_STATUS_FILTERS,
  INCIDENT_STATUS_COLORS_PASTEL
};
