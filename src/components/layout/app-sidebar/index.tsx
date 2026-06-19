"use client";

import {
  MinaBuilding,
  MinaClipboard,
  MinaFolderKanban,
  MinaHome,
  MinaMap,
  MinaUserSettings,
} from "@zcorvus/icons-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppStore } from "@/store/app/app.provider";
import styles from "./app-sidebar.module.scss";
import type { NavigationGroup, NavigationItem } from "./app-sidebar.types";
import { SidebarNavigationItem } from "./sidebar-navigation-item";
import { Logo } from "@/components/common/logo";

const AppSidebar = () => {
  const pathname = usePathname();

  const tCommon = useTranslations("common");
  const tSidebar = useTranslations("layout.sidebar");
  const tRoutes = useTranslations("common.routes");

  const { setOpenMobile } = useSidebar();

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const hasActiveOrganization = useAppStore((state) => Boolean(state.activeOrganization),);
  const activeProject = useAppStore((state) => state.activeProject);
  const hasActiveProject = Boolean(activeProject);
  const activeOrganization = useAppStore((state) => state.activeOrganization);

  const closeMobileSidebar = () => {
    setOpenMobile(false);
  };

  const navigationGroups: NavigationGroup[] = [
    {
      items: [
        {
          label: tRoutes("dashboard"),
          href: "/",
          icon: MinaHome,
        },
      ],
    },
    {
      label: tRoutes("general"),
      items: [
        {
          label: tRoutes("projects"),
          href: "/projects",
          icon: MinaFolderKanban,
          requiresAuth: true,
          requiresOrganization: true,
        },
        {
          label: tRoutes("incidents"),
          href: "/incidents",
          icon: MinaClipboard,
          badge: "3",
          requiresAuth: true,
          requiresOrganization: true,
          requiresProject: true,
        },
        {
          label: tRoutes("map"),
          href: "/map",
          icon: MinaMap,
          requiresAuth: true,
          requiresOrganization: true,
          requiresProject: true,
        },
        {
          label: tRoutes("organizations"),
          href: "/organizations",
          icon: MinaBuilding,
          requiresAuth: true,
        },
      ],
    },
  ];

  const footerItem: NavigationItem = {
    label: tRoutes("settings"),
    href: "/settings",
    icon: MinaUserSettings,
    requiresAuth: true,
  };

  return (
    <Sidebar
      mobileTitle={tSidebar("navigation")}
      mobileDescription={tSidebar("navigation_description")}
    >
      <SidebarHeader>
        <Link
          href="/"
          className={styles.brand}
          onClick={closeMobileSidebar}
        >
          <span className={styles.brandMark}>
            <Logo className={styles.logo} />
          </span>
          <div className={styles.brandText}>
            <span>{activeProject?.name ? activeProject.name : tCommon("brand")}</span>
            <p>{activeOrganization?.name ? activeOrganization.name : tCommon("brand")}</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label ?? groupIndex}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarNavigationItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    isAuthenticated={isAuthenticated}
                    hasActiveOrganization={hasActiveOrganization}
                    hasActiveProject={hasActiveProject}
                    onNavigate={closeMobileSidebar}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarNavigationItem
            item={footerItem}
            pathname={pathname}
            isAuthenticated={isAuthenticated}
            hasActiveOrganization={hasActiveOrganization}
            hasActiveProject={hasActiveProject}
            onNavigate={closeMobileSidebar}
          />
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail label={tSidebar("toggle")} />
    </Sidebar>

  );
}

export { AppSidebar };
