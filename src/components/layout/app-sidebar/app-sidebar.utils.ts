import type { NavigationItem } from "./app-sidebar.types";

interface IsRouteActiveProps {
  pathname: string;
  href: string;
}

interface IsItemDisabledProps {
  item: NavigationItem;
  isAuthenticated: boolean;
  hasActiveOrganization: boolean;
}

const isRouteActive = ({ pathname, href }: IsRouteActiveProps) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const isItemDisabled = ({ item, isAuthenticated, hasActiveOrganization }: IsItemDisabledProps) => {
  if (item.requiresAuth && !isAuthenticated) {
    return true;
  }

  if (item.requiresOrganization && !hasActiveOrganization) {
    return true;
  }

  return false;
};

export { isItemDisabled, isRouteActive };
