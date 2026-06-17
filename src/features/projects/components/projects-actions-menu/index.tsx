"use client";

import { useState } from "react";
import { MinaDotsVertical } from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Link, useRouter } from "@/i18n/navigation";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { useAppStore } from "@/store/app/app.provider";
import { setActiveProjectServerAction } from "../../actions/set-active-project/set-active-project.server";
import type { ProjectListItem } from "../../queries/get-active-organization-projects";
import styles from "./projects-actions-menu.module.scss";

interface ProjectsActionsMenuProps {
  project: ProjectListItem;
  isActive: boolean;
  triggerClassName?: string;
}

const ProjectsActionsMenu = ({ project, isActive, triggerClassName }: ProjectsActionsMenuProps) => {
  const t = useTranslations("projects.list");
  const router = useRouter();
  const setActiveProject = useAppStore((state) => state.setActiveProject);
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSetActiveProject = async () => {
    if (isActive || isPending) {
      return;
    }

    setIsPending(true);

    try {
      const state = await setActiveProjectServerAction({
        projectId: project.id,
      });

      if (state.status !== FORM_STATUS.SUCCESS) {
        toast.error(t("set_active_error"));
        return;
      }

      setActiveProject({
        project: {
          id: project.id,
          organizationId: project.organizationId,
          name: project.name,
          slug: project.slug,
        },
      });
      toast.success(t("set_active_success"));
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(t("set_active_error"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={triggerClassName}
          aria-label={t("actions_label")}
          disabled={isPending}
        >
          <MinaDotsVertical className={styles.triggerIcon} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.content}>
        <DropdownMenuItem
          className={styles.item}
          disabled={isActive || isPending}
          onSelect={(event) => {
            event.preventDefault();
            void handleSetActiveProject();
          }}
        >
          {isPending ? t("setting_active") : t("set_active")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={styles.item}>
          <Link href={`/projects/${project.id}`}>
            {t("view_detail")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ProjectsActionsMenu };
