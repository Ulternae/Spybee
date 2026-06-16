import { Locale } from "@/i18n/routing"
import { User } from "better-auth/client"

export interface Activity {
  country: string | null;
  browser: string | null;
  os: string | null;
}

interface TemplatesProps {
  user: User
  url: string
  locale: Locale
  activity?: Activity
}

export type { TemplatesProps }