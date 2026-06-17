"use client";

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
import { Link } from "@/i18n/navigation";
import { useAppStore } from "@/store/app/app.provider";
import type { ProjectListItem } from "../../queries/get-active-organization-projects";
import styles from "./projects-actions-menu.module.scss";

interface ProjectsActionsMenuProps {
  project: ProjectListItem;
  isActive: boolean;
  triggerClassName?: string;
}

const ProjectsActionsMenu = ({ project, isActive, triggerClassName }: ProjectsActionsMenuProps) => {
  const t = useTranslations("projects.list");
  const setActiveProject = useAppStore((state) => state.setActiveProject);

  const handleSetActiveProject = () => {
    if (isActive) {
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
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={triggerClassName}
          aria-label={t("actions_label")}
        >
          <MinaDotsVertical className={styles.triggerIcon} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.content}>
        <DropdownMenuItem
          className={styles.item}
          disabled={isActive}
          onSelect={handleSetActiveProject}
        >
          {t("set_active")}
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
