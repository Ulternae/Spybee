import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { NavigationItem } from "./app-sidebar.types";
import { isItemDisabled, isRouteActive } from "./app-sidebar.utils";
import { Link } from "@/i18n/navigation";

interface SidebarNavigationItemProps {
  item: NavigationItem;
  pathname: string;
  isAuthenticated: boolean;
  hasActiveOrganization: boolean;
  onNavigate: () => void;
}

const SidebarNavigationItem = ({ item, pathname, isAuthenticated, hasActiveOrganization, onNavigate }: SidebarNavigationItemProps) => {

  const Icon = item.icon;

  const disabled = isItemDisabled({ item, isAuthenticated, hasActiveOrganization });
  const active = !disabled && isRouteActive({ pathname, href: item.href });

  const content = (
    <>
      <Icon aria-hidden="true" />
      <span>{item.label}</span>
      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    </>
  );

  return (
    <SidebarMenuItem>
      {disabled ? (
        <SidebarMenuButton
          disabled
          aria-disabled="true"
          isActive={false}
          tooltip={item.label}
        >
          {content}
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
          <Link href={item.href} onClick={onNavigate}>
            {content}
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

export { SidebarNavigationItem }
