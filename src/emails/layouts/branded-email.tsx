import { Locale } from "@/i18n/routing"
import { BaseEmail } from "./base-email";
import { Column, Container, Heading, Img, Preview, Row, Section, Text } from "react-email";
import { createTranslator } from "next-intl";

interface BrandedEmailProps {
  children: React.ReactNode
  title: string;
  preview: string;
  locale: Locale
}

const BrandedEmail = async ({ children, locale, title, preview }: BrandedEmailProps) => {

  const t = createTranslator({
    messages: await import(`@/messages/${locale}/email.json`),
    namespace: 'brand.footer',
    locale,
  });

  return (
    <BaseEmail locale={locale}>

      <Preview>
        {preview}
      </Preview>

      <Container className="max-w-[560px] mx-auto p-2 rounded-[12px] border border-[#EAEAEA] bg-[#fbfbfb]">
        <Section className="bg-white px-[40px] py-[60px] m-0 rounded-t-md border border-[#EAEAEA]">
          <Section className="mb-8 text-start">
            <Row>
              <Column className="w-[26px]">
                <Img
                  src="https://spybee.zcorvus.com/brand/logo.png"
                  width="26"
                  height="26"
                  alt="SPYBEE"
                />
              </Column>
              <Column className="pl-2">
                <Heading className="text-black text-[24px] font-medium m-0 text-start leading-none"
                >
                  {title}
                </Heading>
              </Column>
            </Row>
          </Section>
          <Section className="text-start">
            {children}
          </Section>
        </Section>
        <Section className="text-center py-8 bg-white border-l border-r border-b border-[#EAEAEA] rounded-b-md">
          <Text className="text-[12px] text-[#222222] leading-tight uppercase m-0">© {new Date().getFullYear()} SPYBEE</Text>
          <Text className="text-[12px] text-[#222222] opacity-70 leading-tight m-0">{t('tagline')}</Text>
        </Section>
      </Container>
    </BaseEmail>
  )
}

export { BrandedEmail }
