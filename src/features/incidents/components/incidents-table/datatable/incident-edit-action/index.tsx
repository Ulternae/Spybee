"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MinaDotsVertical } from "@zcorvus/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { IncidentFormOptions } from "@/features/incidents/queries/get-incident-form-options";
import type { IncidentTableItem } from "@/features/incidents/queries/get-incidents-table";
import type { IncidentFormInput } from "@/features/incidents/schemas/incident.schema";
import { IncidentForm } from "../../../incident-form";
import styles from "../../incidents-table.module.scss";

interface IncidentEditActionProps {
  incident: IncidentTableItem;
  options: IncidentFormOptions;
  onSuccess: () => void;
}

const getIncidentInitialValues = (
  incident: IncidentTableItem,
): Partial<IncidentFormInput> => ({
  title: incident.title,
  description: incident.description,
  categoryId: incident.category.id,
  priority: incident.priority,
  tagIds: incident.tagIds,
  assigneeIds: incident.assigneeIds,
  observerIds: incident.observerIds,
  latitude: incident.latitude,
  longitude: incident.longitude,
  locationDescription: incident.locationDescription ?? "",
  dueDate: incident.dueDate ? new Date(incident.dueDate) : new Date(),
});

const IncidentEditAction = ({ incident, options, onSuccess }: IncidentEditActionProps) => {
  const tActions = useTranslations("common.actions");
  const tEdit = useTranslations("incidents.edit");
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={styles.actionButton}
            aria-label={tActions("edit")}
            data-incident-id={incident.id}
          >
            <MinaDotsVertical
              className={styles.triggerIcon}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={styles.actionsContent}>
          <DropdownMenuItem
            className={styles.actionItem}
            onSelect={() => setOpen(true)}
          >
            {tActions("edit")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{tEdit("title")}</SheetTitle>
            <SheetDescription>{tEdit("description")}</SheetDescription>
          </SheetHeader>

          <IncidentForm
            key={incident.id}
            mode="edit"
            incidentId={incident.id}
            data={{
              location: {
                latitude: incident.latitude,
                longitude: incident.longitude,
              },
              options,
            }}
            actions={{
              onChangeState: setOpen,
              onSuccess: handleSuccess,
            }}
            initialValues={getIncidentInitialValues(incident)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export { IncidentEditAction };
export type { IncidentEditActionProps };
