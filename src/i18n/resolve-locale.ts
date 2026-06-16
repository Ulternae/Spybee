import { COOKIE_KEYS, getCookie } from "@/lib/http/cookies";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./routing";

interface ResolveLocaleFromRequestParams {
  req?: Request;
}

const resolveLocaleFromRequest = ({ req }: ResolveLocaleFromRequestParams): Locale => {
  const cookieLocale = getCookie({ req, key: COOKIE_KEYS.NEXT_LOCALE })

  if (!!cookieLocale && LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  return DEFAULT_LOCALE
}


export { resolveLocaleFromRequest }