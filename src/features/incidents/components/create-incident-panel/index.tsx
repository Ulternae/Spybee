"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import type {
  ActionsForm,
  DataForm,
  ReadyDataForm,
} from "@/features/incidents/types/incident.types";
import { IncidentForm } from "../incident-form";
import styles from "./create-incident-panel.module.scss";

interface CreateIncidentPanelProps {
  open: boolean;
  data: DataForm;
  actions: ActionsForm;
}

const CreateIncidentPanel = ({ data, open, actions }: CreateIncidentPanelProps) => {
  const t = useTranslations("incidents.create");
  const formData: ReadyDataForm | null = data.location ? { ...data, location: data.location, } : null;

  return (
    <Sheet open={open} onOpenChange={actions.onChangeState}>
      <SheetContent className={styles.content}>
        <SheetHeader className={styles.header}>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        {formData && (
          <IncidentForm
            data={formData}
            actions={actions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export { CreateIncidentPanel };
