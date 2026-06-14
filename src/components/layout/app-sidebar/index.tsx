"use client";

import {
  MinaBuilding,
  MinaClipboard,
  MinaHome,
  MinaMap,
  MinaUserSettings,
  type MinaHomeProps,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import styles from "./app-sidebar.module.scss";

type NavigationIcon = React.ComponentType<MinaHomeProps>;

interface NavigationItem {
  label: string;
  href: string;
  icon: NavigationIcon;
  badge?: string;
}

interface NavigationGroup {
  label?: string;
  items: NavigationItem[];
}

function AppSidebar() {
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tSidebar = useTranslations("common.sidebar");
  const tRoutes = useTranslations("common.routes");
  const { setOpenMobile } = useSidebar();

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
          label: tRoutes("incidents"),
          href: "/incidents",
          icon: MinaClipboard,
          badge: "3",
        },
        {
          label: tRoutes("map"),
          href: "/map",
          icon: MinaMap,
        },
      ],
    },
  ];

  return (
    <Sidebar
      mobileTitle={tSidebar("navigation")}
      mobileDescription={tSidebar("navigation_description")}
    >
      <SidebarHeader>
        <Link
          href="/"
          className={styles.brand}
          onClick={() => setOpenMobile(false)}
        >
          <span className={styles.brandMark}>
            <MinaBuilding aria-hidden="true" />
          </span>
          <span className={styles.brandText}>{tCommon("brand")}</span>
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
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpenMobile(false)}
                        >
                          <Icon aria-hidden="true" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={tRoutes("settings")}>
              <Link href="/settings" onClick={() => setOpenMobile(false)}>
                <MinaUserSettings aria-hidden="true" />
                <span>{tRoutes("settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail label={tSidebar("toggle")} />
    </Sidebar>
  );
}

export { AppSidebar };
