"use client";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/routing";
import { useParams } from "next/navigation";

const isLocale = (value: string): value is Locale => LOCALES.includes(value as Locale);

const useLocale = () => {

  const params = useParams<{ locale?: string }>();

  const localeParam = params.locale;
  const currentLocale = localeParam && isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const currentLocaleIndex = LOCALES.indexOf(currentLocale);
  const nextLocale = LOCALES[(currentLocaleIndex + 1) % LOCALES.length];

  return { currentLocale, nextLocale };

};

export { useLocale };
