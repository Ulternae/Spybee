import type { MinaHomeProps } from "@zcorvus/icons-react";

type NavigationIcon = React.ComponentType<MinaHomeProps>;

interface NavigationItem {
  label: string;
  href: string;
  icon: NavigationIcon;
  badge?: string;
  requiresAuth?: boolean;
  requiresOrganization?: boolean;
}

interface NavigationGroup {
  label?: string;
  items: NavigationItem[];
}

export type { NavigationGroup, NavigationIcon, NavigationItem };
