"use client";

import { useMemo, useState } from "react";
import { IncidentPriority, IncidentStatus } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CreateIncidentPanel } from "@/features/incidents/components/create-incident-panel";
import type { IncidentLocation } from "@/features/incidents/components/location-preview";
import type { ActionsForm, DataForm } from "@/features/incidents/types/incident.types";
import { filterIncidents } from "../../lib/filter-incidents";
import { MapFilters } from "../map-filters";
import { MapboxMap } from "../mapbox-map";
import type { ActiveProjectMap } from "../../queries/get-active-project-map";
import styles from "./map-panel.module.scss";

interface MapPanelProps {
  data: ActiveProjectMap;
}

const MapPanel = ({ data }: MapPanelProps) => {

  const [statusFilter, setStatusFilter] = useState<IncidentStatus | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<IncidentLocation | null>(null);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);

  const router = useRouter();
  const t = useTranslations("map.create_incident");
  const filteredIncidents = useMemo(() => {
    return filterIncidents(data.incidents, {
      priority: priorityFilter,
      status: statusFilter,
    });
  }, [data.incidents, priorityFilter, statusFilter]);

  const handleStartCreateIncident = () => {
    setSelectedLocation(null);
    setIsCreatePanelOpen(false);
    setIsSelectingLocation(true);
  };

  const handleLocationSelect = (location: IncidentLocation) => {
    setSelectedLocation(location);
    setIsCreatePanelOpen(true);
    setIsSelectingLocation(false);
  };

  const handleCreatePanelOpenChange = (open: boolean) => {
    setIsCreatePanelOpen(open);

    if (!open) {
      setSelectedLocation(null);
      setIsSelectingLocation(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreatePanelOpen(false);
    setSelectedLocation(null);
    setIsSelectingLocation(false);
    router.refresh();
  };

  const actions: ActionsForm = {
    onChangeState: handleCreatePanelOpenChange,
    onSuccess: handleCreateSuccess,
  }

  const dataForm: DataForm = {
    location: selectedLocation,
    options: data.incidentFormOptions,
  }

  return (
    <main className={styles.root}>
      <section className={styles.container}>
        <MapFilters
          priority={priorityFilter}
          status={statusFilter}
          onPriorityChange={setPriorityFilter}
          onStatusChange={setStatusFilter}
        />
        {data.access.canCreateIncidents && (
          <div className={styles.createControls}>
            {isSelectingLocation && (
              <span className={styles.selectionHint}>{t("selection_hint")}</span>
            )}
            <Button
              type="button"
              onClick={handleStartCreateIncident}
              disabled={isSelectingLocation}
            >
              {t("button")}
            </Button>
          </div>
        )}
        <MapboxMap
          incidents={filteredIncidents}
          selectionMode={isSelectingLocation}
          onLocationSelect={handleLocationSelect}
        />
        <CreateIncidentPanel
          open={isCreatePanelOpen}
          actions={actions}
          data={dataForm}
        />
      </section>
    </main>
  );
};

export { MapPanel };
