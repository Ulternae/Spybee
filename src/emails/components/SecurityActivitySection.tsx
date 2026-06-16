import { Section, Text } from "react-email";
import { createTranslator } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Activity } from "../types/templates.types";
import { Locale } from "@/i18n/routing";

interface SecurityActivitySectionProps {
  locale: Locale
  className?: string
  activity: Activity
  t: ReturnType<typeof createTranslator>
}

const SecurityActivitySection = ({
  locale,
  className,
  activity,
  t
}: SecurityActivitySectionProps) => {

  const { country, browser, os } = activity;

  const regionName = new Intl.DisplayNames([locale], { type: "region" });
  const region = country ? regionName.of(country) : "";

  return (
    <Section className={cn(className)}>
      <Text className="text-[#222222] text-[14px] leading-tight m-0 font-semibold">
        {t("detected")}
      </Text>
      {country && (
        <Text className="text-[#5e5e5e] text-[13px] leading-tight m-0">
          {t("location")} {region}
        </Text>
      )}
      <Text className="text-[#5e5e5e] text-[13px] leading-tight m-0">
        {t("device")} {browser} · {os}
      </Text>
    </Section>
  );
};

export { SecurityActivitySection }