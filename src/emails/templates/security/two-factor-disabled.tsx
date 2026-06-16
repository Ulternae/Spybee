import { Button, Text } from "react-email";
import { createTranslator } from "next-intl";

import { BrandedEmail } from "@/emails/layouts/branded-email";
import { SecurityActivitySection } from "@/emails/components/SecurityActivitySection";
import { TemplatesProps } from "@/emails/types/templates.types";

const TwoFactorDisabledEmail = async ({ user, locale, url, activity }: TemplatesProps) => {

  const t = createTranslator({
    messages: await import(`@/messages/${locale}/email.json`),
    namespace: "two_factor_disabled",
    locale,
  });

  const security = createTranslator({
    messages: await import(`@/messages/${locale}/email.json`),
    namespace: "security_activity",
    locale,
  });

  return (
    <BrandedEmail title={t("heading")} preview={t("preview")} locale={locale}>
      <Text className="text-[#222222] text-[14px] leading-tight m-0 mb-8">
        {t("body.greeting", { name: user.name })} {t("body.message")}
      </Text>

      {activity && (
        <SecurityActivitySection t={security} locale={locale} activity={activity} className="mb-8" />
      )}

      <Button
        href={url}
        className="bg-black text-[#F8F8F8] text-[14px] font-medium px-7 py-3 rounded-xl no-underline mt-0 mb-8"
      >
        {t("body.button")}
      </Button>
      <Text className="text-[12px] text-[#888888] leading-tight m-0 text-start">
        {t("body.footer")}
      </Text>
    </BrandedEmail>
  );
};

export { TwoFactorDisabledEmail };
