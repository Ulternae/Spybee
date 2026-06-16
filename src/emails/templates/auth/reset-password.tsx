import {
  Button,
  Text,
} from "react-email";
import { Locale } from "@/i18n/routing";
import { createTranslator } from 'next-intl';
import { BrandedEmail } from "@/emails/layouts/branded-email";
import type { User } from "better-auth";

interface ResetPasswordProps {
  user: User;
  url: string;
  locale: Locale;
}

const ResetPassword = async ({ user, url, locale }: ResetPasswordProps) => {

  const t = createTranslator({
    messages: await import(`@/messages/${locale}/email.json`),
    namespace: 'reset_password',
    locale,
  });

  return (
    <BrandedEmail title={t('heading')} preview={t('preview')} locale={locale}>
      <Text className="text-[#222222] text-[14px] leading-tight m-0 mb-8">
        {t('body.request', { name: user.name })}
      </Text>
      <Button
        href={url}
        className="bg-black text-[#F8F8F8] text-[14px] font-medium px-7 py-3 rounded-xl no-underline mt-0 mb-8"
      >
        {t('body.button')}
      </Button>
      <Text className="text-[#222222] text-[14px] leading-tight m-0">
        {t('body.ignore_title')}
        <br />
        {t('body.ignore_text')}              </Text>
    </BrandedEmail>
  );
};

export { ResetPassword };
