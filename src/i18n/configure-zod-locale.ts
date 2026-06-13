import * as z from "zod";
import type { Locale } from "./routing";

interface ConfigureZodLocaleParams {
  locale: Locale;
}

const configureZodLocale = async ({ locale }: ConfigureZodLocaleParams) => {

  const { default: zodLocale } = await import(`zod/v4/locales/${locale}.js`);
  z.config(zodLocale());

};

export { configureZodLocale };
