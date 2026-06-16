import { Locale } from "@/i18n/routing";
import { Body, Head, Html, Tailwind } from "react-email";
import React from "react";

interface BaseEmailProps {
  children: React.ReactNode
  locale: Locale
}

const BaseEmail = ({ children, locale }: BaseEmailProps) => {
  const [preview, content] = React.Children.toArray(children);

  return (
    <Html lang={locale}>
      <Head>
        <meta charSet="UTF-8" />
      </Head>
      {preview}
      <Tailwind >
        <Body
          className="bg-background text-foreground m-0 py-10 font-serif"
          lang={locale}
          style={{ fontFamily: "ui-sans-serif,system-ui,sans-serif" }}
        >
          {content}
        </Body>
      </Tailwind>
    </Html>
  )
}

export { BaseEmail }