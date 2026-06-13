"use client";

import { configureZodLocale } from "@/i18n/configure-zod-locale";
import { DEFAULT_LOCALE, routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { useEffect } from "react";

interface ZodLocaleSyncProps {
  locale: string;
}


const ZodLocaleSync = ({ locale }: ZodLocaleSyncProps) => {

  const currentLocale = hasLocale(routing.locales, locale) ? locale : DEFAULT_LOCALE;

  useEffect(() => {
    void configureZodLocale({ locale: currentLocale });
  }, [currentLocale]);

  return null;
};

export { ZodLocaleSync };
