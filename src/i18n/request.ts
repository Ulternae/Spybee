import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      layout: (await import(`../messages/${locale}/layout.json`)).default,
      auth: (await import(`../messages/${locale}/auth.json`)).default,
      error: (await import(`../messages/${locale}/error.json`)).default,
      settings: (await import(`../messages/${locale}/settings.json`)).default,
      organizations: (await import(`../messages/${locale}/organizations.json`)).default,
      projects: (await import(`../messages/${locale}/projects.json`)).default,
      dashboard: (await import(`../messages/${locale}/dashboard.json`)).default,
      incidents: (await import(`../messages/${locale}/incidents.json`)).default,
      map: (await import(`../messages/${locale}/map.json`)).default,
      calendar: (await import(`../messages/${locale}/calendar.json`)).default,
    },
  };
});
