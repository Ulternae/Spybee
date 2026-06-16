import { Button, Link, Text } from "react-email"
import { Locale } from "@/i18n/routing"
import { createTranslator } from 'next-intl';
import { BrandedEmail } from "@/emails/layouts/branded-email";
import type { User } from "better-auth";

interface VerifyAccountEmailProps {
  user: User
  url: string
  locale: Locale
}

const VerifyAccountEmail = async ({ user, url, locale }: VerifyAccountEmailProps) => {

  const t = createTranslator({
    messages: await import(`@/messages/${locale}/email.json`),
    namespace: 'verify_account',
    locale,
  });

  return (
    <BrandedEmail title={t('heading')} preview={t('preview')} locale={locale}>
      <Text className="text-[#222222] text-[14px] leading-tight m-0 mb-8">
        {t('body.welcome', { name: user.name })}
      </Text>
      <Button
        href={url}
        className="bg-black text-[#F8F8F8] text-[14px] font-medium px-7 py-3 rounded-xl no-underline mt-0 mb-8"
      >
        {t('body.button')}
      </Button>
      <Text className="text-[#222222] text-[14px] leading-tight m-0 mb-6">
        {t('body.ignore_title')}
        <br />
        {t('body.ignore_text')}
      </Text>
      <Text className="text-[12px] text-[#888888] leading-tight m-0 break-all">
        {t('body.link')}
        <br />
        <Link href={url} className="text-[#888888] underline">
          {url}
        </Link>
      </Text>
    </BrandedEmail>
  )
}

export { VerifyAccountEmail }


